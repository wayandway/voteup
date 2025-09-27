"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { VoteService } from "@/lib";
import { toast } from "sonner";
import type { Vote as VoteType } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Button,
  Input,
  Textarea,
} from "@/components/ui";
import Link from "next/link";
import AvatarMenu from "@/components/layouts/avatar-menu";
import { VoteOptionsEditor, VoteSettings } from "@/components/vote";

export default function EditVotePage() {
  const params = useParams();
  const router = useRouter();
  const voteId = params.id as string;
  const [vote, setVote] = useState<VoteType | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const [scaleMin, setScaleMin] = useState(1);
  const [scaleMax, setScaleMax] = useState(5);
  const [scaleStep, setScaleStep] = useState(1);

  useEffect(() => {
    const fetchVote = async () => {
      setLoading(true);
      try {
        const voteData = await VoteService.getVoteById(voteId);
        setVote(voteData);
        setTitle(voteData.title);
        setDescription(voteData.description || "");
        setOptions(
          (voteData.options || []).map((opt: any) => ({
            ...opt,
            image_file: undefined,
          }))
        );
        if (voteData.vote_type === "scale") {
          setScaleMin(voteData.scale_min ?? 1);
          setScaleMax(voteData.scale_max ?? 5);
          setScaleStep(voteData.scale_step ?? 1);
        }
      } catch (error: any) {
        toast.error(error.message || "투표 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    if (voteId) fetchVote();
  }, [voteId]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    if (!vote) {
      toast.error("투표 정보를 찾을 수 없습니다.");
      return;
    }
    if (vote.vote_type !== "scale") {
      if (options.length === 0 || options.some((o) => !o.text.trim())) {
        toast.error("모든 선택지 내용을 입력해주세요.");
        return;
      }
    }
    try {
      const updateData: any = { title, description, options };
      if (vote.vote_type === "scale") {
        updateData.scale_min = scaleMin;
        updateData.scale_max = scaleMax;
        updateData.scale_step = scaleStep;
      }
      await VoteService.updateVote(voteId, updateData);
      toast.success("투표가 수정되었습니다.");
      router.push(`/vote/${voteId}`);
    } catch (error: any) {
      toast.error(error.message || "수정에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!vote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        투표 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--stone-100)] pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-gray-700"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="text-base text-gray-700 font-medium">
                돌아가기
              </span>
            </Link>
            <div className="flex-shrink-0">
              <AvatarMenu />
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>투표 수정</CardTitle>
              <CardDescription>
                투표 제목과 설명을 수정할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">제목</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">설명</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <VoteSettings
                  voteType={vote.vote_type}
                  maxSelections={vote.max_selections}
                  scaleMin={scaleMin}
                  scaleMax={scaleMax}
                  scaleStep={scaleStep}
                  onMaxSelectionsChange={() => {}}
                  onScaleMinChange={setScaleMin}
                  onScaleMaxChange={setScaleMax}
                  onScaleStepChange={setScaleStep}
                />
              </div>
              <div>
                <VoteOptionsEditor
                  voteType={vote.vote_type}
                  options={options}
                  onOptionsChange={setOptions}
                />
              </div>
              <Button onClick={handleSave} className="w-full mt-4">
                저장
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
