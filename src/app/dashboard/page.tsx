"use client";

import { useEffect, useCallback, useState } from "react";
import { VoteService, createClient, generateVoteLink } from "@/lib";
import { useAuthStore, useVoteStore } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DashboardSidebar, DashboardHeader, VoteList } from "./components";
import { useIsMobile } from "@/hooks";
import { Button } from "@/components/ui";
import { Smartphone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Vote } from "@/types";

export default function DashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuthStore();
  const { votes, setVotes, loading, setLoading } = useVoteStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchVotes = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const votesData = await VoteService.getUserVotes(user.id);
      setVotes(votesData);
    } catch (error: any) {
      toast.error(
        error.message || "투표 목록을 불러오는 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [setLoading, setVotes, user]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push("/auth/signin");
      return;
    }

    fetchVotes();

    const supabase = createClient();
    const subscription = supabase
      .channel("dashboard-responses")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "responses",
        },
        () => {
          fetchVotes();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, authLoading, fetchVotes, router, user]);

  const toggleVoteStatus = async (voteId: string, currentStatus: boolean) => {
    try {
      await VoteService.toggleVoteStatus(voteId, !currentStatus);
      toast.success(
        currentStatus ? "투표를 종료했습니다." : "투표를 시작했습니다."
      );
      fetchVotes();
    } catch (error: any) {
      toast.error(error.message || "투표 상태 변경 중 오류가 발생했습니다.");
    }
  };

  const copyVoteLink = async (voteId: string) => {
    const link = generateVoteLink(voteId);
    try {
      await navigator.clipboard.writeText(link);
      toast.success("투표 링크가 복사되었습니다!");
    } catch {
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  const deleteVote = async (voteId: string) => {
    try {
      await VoteService.deleteVote(voteId);
      toast.success("투표가 성공적으로 삭제되었습니다.");
      fetchVotes();
    } catch (error: any) {
      toast.error(error.message || "투표 삭제 중 오류가 발생했습니다.");
    }
  };

  const getFilteredVotes = (): Vote[] => {
    switch (filter) {
      case "active":
        return votes.filter((vote) => vote.is_open);
      case "completed":
        return votes.filter((vote) => !vote.is_open);
      default:
        return votes;
    }
  };

  if (!mounted) {
    return null;
  }

  // 모바일 접근 차단
  if (isMobile) {
    return (
      <div className="min-h-screen bg-[var(--stone-100)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-10 h-10 text-blue-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            데스크톱에서 이용해 주세요
          </h1>

          <p className="text-gray-600 mb-8 leading-relaxed">
            대시보드는 현재 데스크톱 환경에 최적화되어 있습니다.
            <br />더 나은 경험을 위해 PC나 태블릿에서 접속해 주세요.
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                홈으로 돌아가기
              </Link>
            </Button>

            <p className="text-sm text-gray-500">
              모바일 최적화는 곧 제공될 예정입니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--stone-100)]">
      <div className="flex">
        <DashboardSidebar
          votes={votes}
          filter={filter}
          onFilterChange={setFilter}
        />

        <div className="flex-1 p-8">
          <DashboardHeader
            userProfile={userProfile}
            voteCount={getFilteredVotes().length}
            filter={filter}
          />

          <VoteList
            votes={votes}
            loading={loading}
            filter={filter}
            onToggleVoteStatus={toggleVoteStatus}
            onCopyVoteLink={copyVoteLink}
            onDeleteVote={deleteVote}
          />
        </div>
      </div>
    </div>
  );
}
