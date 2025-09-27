"use client";

import { useEffect, useCallback, useState } from "react";
import { VoteService, createClient, generateVoteLink } from "@/lib";
import { useAuthStore, useVoteStore } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DashboardSidebar, DashboardHeader, VoteList } from "./components";
import OverviewCards from "./components/overview-cards";
import OverviewAreaChart from "./components/overview-area-chart";
import { useIsMobile } from "@/hooks";
import { Button } from "@/components/ui";
import { Smartphone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Vote } from "@/types";

// 최근 7일간 참여 추이 데이터 생성 함수
function getParticipationTrend(
  votes: Vote[]
): { date: string; count: number }[] {
  const days = 7;
  const now = new Date();
  const trend: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
    // 각 투표의 created_at이 해당 날짜와 일치하면 참여자 수 합산
    const count = votes
      .filter((v) => {
        if (!v.created_at) return false;
        const created = new Date(v.created_at);
        return (
          created.getFullYear() === d.getFullYear() &&
          created.getMonth() === d.getMonth() &&
          created.getDate() === d.getDate()
        );
      })
      .reduce((sum, v) => sum + (v.participant_count || 0), 0);
    trend.push({ date: dateStr, count });
  }
  return trend;
}

export default function DashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuthStore();
  const { votes, setVotes, loading, setLoading } = useVoteStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<
    "overview" | "all" | "active" | "completed"
  >("overview");
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
    <div className="min-h-screen bg-white flex h-screen">
      {/* 사이드바 고정 (w-50) */}
      <div className="h-screen w-50 flex-shrink-0 relative">
        <DashboardSidebar
          votes={votes}
          filter={filter}
          onFilterChange={setFilter}
        />
      </div>
      {/* 메인 영역: 헤더 고정, 나머지만 스크롤 */}
      <div className="flex-1 flex flex-col h-screen">
        <div className="sticky top-0 z-10 w-full">
          <DashboardHeader
            userProfile={userProfile}
            voteCount={getFilteredVotes().length}
            filter={filter}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          {filter === "overview" ? (
            <>
              <OverviewCards
                votes={votes}
                participantCount={votes.reduce(
                  (sum, v) => sum + (v.participant_count || 0),
                  0
                )}
                recentVotes={votes.slice(0, 5)}
                popularVote={
                  votes.reduce(
                    (max, v) =>
                      (v.participant_count || 0) > (max.participant_count || 0)
                        ? v
                        : max,
                    votes[0]
                  ) || undefined
                }
              />
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2">
                  일주일 간 참여자 수
                </h2>
                <OverviewAreaChart data={getParticipationTrend(votes)} />
              </div>
            </>
          ) : (
            <VoteList
              votes={(() => {
                switch (filter) {
                  case "active":
                    return votes.filter((vote) => vote.is_open);
                  case "completed":
                    return votes.filter((vote) => !vote.is_open);
                  default:
                    return votes;
                }
              })()}
              loading={loading}
              filter={filter}
              onToggleVoteStatus={toggleVoteStatus}
              onCopyVoteLink={copyVoteLink}
              onDeleteVote={deleteVote}
            />
          )}
        </div>
      </div>
    </div>
  );
}
