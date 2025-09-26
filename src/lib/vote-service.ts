import { createClient } from "./supabase";
import { ImageService } from "./image-service";
import type {
  Vote,
  CreateVoteData,
} from "@/types/vote";

export class VoteService {
  private static supabase = createClient();

  static async createVote(data: CreateVoteData): Promise<Vote> {
    const supabase = this.supabase;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("로그인이 필요합니다.");
    }

    const { data: vote, error: voteError } = await (supabase as any)
      .from("votes")
      .insert({
        host_id: user.id, 
        title: data.title,
        description: data.description,
        vote_type: data.vote_type,
        is_open: false,
        expires_at: data.expires_at,
        max_selections: data.max_selections,
        scale_min: data.scale_min,
        scale_max: data.scale_max,
        scale_step: data.scale_step,
      })
      .select()
      .single();

    if (voteError) throw new Error(`투표 생성 실패: ${voteError.message}`);

    if (data.vote_type !== "scale" && data.options?.length > 0) {
      const optionsData = await Promise.all(
        data.options.map(async (option, index) => {
          let imageUrl = option.image_url;

          if (option.image_file) {
            try {
              imageUrl = await ImageService.uploadImage(
                option.image_file,
                vote.id,
                index
              );
            } catch {
              imageUrl = undefined;
            }
          }

          return {
            vote_id: vote.id,
            text: option.text,
            image_url: imageUrl,
            image_alt: option.image_alt,
            display_order: index,
          };
        })
      );

      const { error: optionsError } = await (supabase as any)
        .from("options")
        .insert(optionsData);

      if (optionsError) {
        await (supabase as any).from("votes").delete().eq("id", vote.id);
        throw new Error(`옵션 생성 실패: ${optionsError.message}`);
      }
    }

    return this.getVoteById(vote.id);
  }

  static async getVoteById(voteId: string): Promise<Vote> {
    const supabase = this.supabase;

    const { data: vote, error: voteError } = await (supabase as any)
      .from("votes")
      .select(
        `
        *,
        options (
          id,
          text,
          image_url,
          image_alt,
          display_order
        )
      `
      )
      .eq("id", voteId)
      .single();

    if (voteError) throw new Error(`투표 조회 실패: ${voteError.message}`);

    if ((vote as any).options) {
      (vote as any).options.sort((a: any, b: any) => a.display_order - b.display_order);
    }

    const { data: responses, error: responseError } = await (supabase as any)
      .from("responses")
      .select("participant_token")
      .eq("vote_id", voteId);

    let participantCount = 0;
    if (!responseError && responses) {
      const uniqueParticipants = new Set(responses.map((r: any) => r.participant_token));
      participantCount = uniqueParticipants.size;
    }

    return { ...vote, participant_count: participantCount } as Vote;
  }

  static async submitVoteResponse(
    voteId: string,
    participantToken: string,
    responses: Array<{
      optionId?: string;
      scaleValue?: number;
      ranking?: number;
    }>
  ): Promise<void> {
    const supabase = this.supabase;

    const responseData = responses.map((response) => ({
      vote_id: voteId,
      participant_token: participantToken,
      option_id: response.optionId || null,
      scale_value: response.scaleValue || null,
      ranking: response.ranking || null,
    }));

    const { error } = await (supabase as any).from("responses").insert(responseData);

    if (error) throw new Error(`응답 제출 실패: ${error.message}`);
  }

  static async getVoteResults(voteId: string) {
    const supabase = this.supabase;

    const { data: responses, error } = await (supabase as any)
      .from("responses")
      .select(
        `
        *,
        options (
          id,
          text,
          display_order
        )
      `
      )
      .eq("vote_id", voteId);

    if (error) throw new Error(`결과 조회 실패: ${error.message}`);

    return responses;
  }

  static async getParticipantResponse(
    voteId: string,
    participantToken: string
  ) {
    const supabase = this.supabase;

    const { data: responses, error } = await (supabase as any)
      .from("responses")
      .select("*")
      .eq("vote_id", voteId)
      .eq("participant_token", participantToken);

    if (error) throw new Error(`응답 조회 실패: ${error.message}`);

    return responses;
  }

  static async getUserVotes(userId: string): Promise<Vote[]> {
    const supabase = this.supabase;

    const { data: votes, error } = await (supabase as any)
      .from("votes")
      .select(
        `
        *,
        options (
          id,
          text,
          image_url,
          image_alt,
          display_order
        )
      `
      )
      .eq("host_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`투표 목록 조회 실패: ${error.message}`);

    const votesWithParticipantCount = await Promise.all(
      votes.map(async (vote: any) => {
        const { data: responses, error: responseError } = await (supabase as any)
          .from("responses")
          .select("participant_token")
          .eq("vote_id", vote.id);

        if (responseError) {
          return { ...vote, participant_count: 0 };
        }

        const uniqueParticipants = new Set(responses.map((r: any) => r.participant_token));
        return { ...vote, participant_count: uniqueParticipants.size };
      })
    );

    return votesWithParticipantCount as Vote[];
  }

  static async deleteVote(voteId: string): Promise<void> {
    const supabase = this.supabase;

    try {
      await ImageService.deleteVoteImages(voteId);
      
      const { error } = await (supabase as any).from("votes").delete().eq("id", voteId);

      if (error) throw new Error(`투표 삭제 실패: ${error.message}`);
    } catch (error: any) {
      throw new Error(`투표 삭제 실패: ${error.message}`);
    }
  }

  static async updateVoteStatus(
    voteId: string,
    isOpen: boolean
  ): Promise<void> {
    const supabase = this.supabase;

    const { error } = await (supabase as any)
      .from("votes")
      .update({ is_open: isOpen })
      .eq("id", voteId);

    if (error) throw new Error(`상태 업데이트 실패: ${error.message}`);
  }

  static subscribeToVoteUpdates(
    voteId: string,
    callback: (payload: any) => void
  ) {
    const supabase = this.supabase;

    return supabase
      .channel(`vote-${voteId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "responses",
          filter: `vote_id=eq.${voteId}`,
        },
        callback
      )
      .subscribe();
  }

  static unsubscribeFromVoteUpdates(subscription: any) {
    subscription?.unsubscribe();
  }

  static async toggleVoteStatus(voteId: string, isOpen: boolean): Promise<void> {
    const supabase = this.supabase;

    const { error } = await (supabase as any)
      .from("votes")
      .update({ is_open: isOpen })
      .eq("id", voteId);

    if (error) {
      throw new Error(`투표 상태 변경 실패: ${error.message}`);
    }
  }

  static async updateVote(
    voteId: string,
    data: { title?: string; description?: string; options?: any[] }
  ) {
    const supabase = this.supabase;
    // 1. 투표 메타데이터 수정
    const { error: voteError } = await (supabase as any)
      .from("votes")
      .update({
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
      })
      .eq("id", voteId);
    if (voteError) throw new Error(`투표 수정 실패: ${voteError.message}`);

    // 2. 옵션 수정
    if (data.options) {
      const { data: existingOptions, error: fetchError } = await (supabase as any)
        .from("options")
        .select("id")
        .eq("vote_id", voteId);
      if (fetchError) throw new Error(`옵션 조회 실패: ${fetchError.message}`);
      const existingIds = (existingOptions || []).map((o: any) => o.id);

      // 2-1. 삭제된 옵션 제거
      const keepIds = data.options.filter((o) => o.id).map((o) => o.id);
      const deleteIds = existingIds.filter((id: string) => !keepIds.includes(id));
      if (deleteIds.length > 0) {
        const { error: deleteError } = await (supabase as any)
          .from("options")
          .delete()
          .in("id", deleteIds);
        if (deleteError) throw new Error(`옵션 삭제 실패: ${deleteError.message}`);
      }

      // 2-2. 옵션 upsert (id 있으면 update, 없으면 insert)
      for (let i = 0; i < data.options.length; i++) {
        const opt = data.options[i];
        const upsertData: any = {
          vote_id: voteId,
          text: opt.text,
          image_url: opt.image_url || null,
          image_alt: opt.image_alt || null,
          display_order: i,
        };
        if (opt.id) upsertData.id = opt.id;

        // 이미지 업로드 처리 (선택)
        if (opt.image_file) {
          try {
            upsertData.image_url = await ImageService.uploadImage(opt.image_file, voteId, i);
          } catch {
            upsertData.image_url = null;
          }
        }

        const { error: upsertError } = await (supabase as any)
          .from("options")
          .upsert(upsertData, { onConflict: "id" });
        if (upsertError) throw new Error(`옵션 저장 실패: ${upsertError.message}`);
      }
    }
  }
}

export const voteService = VoteService;
