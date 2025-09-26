"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { VoteService } from "@/lib";
import { useAuthStore } from "@/store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import type { Vote as VoteType } from "@/types";

export default function VoteAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const voteId = params.id as string;
  const { user } = useAuthStore();
  const [vote, setVote] = useState<VoteType | null>(null);
  const [voteResults, setVoteResults] = useState<any[]>([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 관리자만 접근 허용
  const fetchVote = useCallback(async () => {
    setLoading(true);
    try {
      const voteData = await VoteService.getVoteById(voteId);
      setVote(voteData);
      setParticipantCount(voteData.participant_count || 0);
      if (!user || voteData.host_id !== user.id) {
        toast.error("접근 권한이 없습니다.");
        router.replace("/vote/" + voteId);
        return;
      }
    } catch (error: any) {
      toast.error(error.message || "투표 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [voteId, user, router]);

  const fetchVoteResults = useCallback(async () => {
    try {
      if (!voteId) return;
      const results = await VoteService.getVoteResults(voteId);
      setVoteResults(results);
    } catch (error) {
      toast.error("투표 결과를 불러오지 못했습니다.");
    }
  }, [voteId]);

  useEffect(() => {
    fetchVote();
  }, [fetchVote]);

  // 실시간 구독
  useEffect(() => {
    if (!voteId) return;
    const subscription = VoteService.subscribeToVoteUpdates(voteId, () => {
      fetchVoteResults();
    });
    return () => {
      VoteService.unsubscribeFromVoteUpdates(subscription);
    };
  }, [voteId, fetchVoteResults]);

  useEffect(() => {
    if (vote) fetchVoteResults();
  }, [vote]);

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

  // 척도 투표: 전체 평균 점수 및 각 점수별(선택지별) 응답 수 집계
  let scaleAvg = null;
  let scaleCount = 0;
  let scaleOptionStats: { value: number; count: number; percentage: number }[] =
    [];
  if (vote.vote_type === "scale") {
    const min = vote.scale_min ?? 1;
    const max = vote.scale_max ?? 5;
    const step = vote.scale_step ?? 1;
    const values = voteResults
      .map((r) => r.scale_value)
      .filter((v) => typeof v === "number");
    scaleCount = values.length;
    if (scaleCount > 0) {
      scaleAvg = values.reduce((sum, v) => sum + v, 0) / scaleCount;
    }
    // 각 점수별 집계
    scaleOptionStats = [];
    for (let v = min; v <= max; v += step) {
      const count = values.filter((val) => val === v).length;
      const percentage =
        scaleCount > 0 ? Math.round((count / scaleCount) * 100) : 0;
      scaleOptionStats.push({ value: v, count, percentage });
    }
  }

  // 순위 투표: 옵션별 평균 순위 계산
  let rankingResults: {
    option_id: string;
    option_text: string;
    avg_ranking: number | null;
    response_count: number;
  }[] = [];
  if (vote.vote_type === "ranking") {
    rankingResults = (vote.options || []).map((option) => {
      const optionResponses = voteResults.filter(
        (r) => r.option_id === option.id && typeof r.ranking === "number"
      );
      const rankings = optionResponses.map((r) => r.ranking);
      const avgRanking =
        rankings.length > 0
          ? rankings.reduce((sum, rank) => sum + rank, 0) / rankings.length
          : null;
      return {
        option_id: option.id,
        option_text: option.text,
        avg_ranking: avgRanking,
        response_count: rankings.length,
      };
    });
  }

  const getOptionCount = (optionId: string) =>
    voteResults.filter((r) => r.option_id === optionId).length;

  const getTotalVotes = () => {
    if (vote.vote_type === "scale") {
      return scaleCount;
    }
    return (vote.options || []).reduce(
      (sum, option) => sum + getOptionCount(option.id),
      0
    );
  };

  return (
    <div className="min-h-screen bg-[var(--stone-100)] pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">투표 결과 분석</CardTitle>
              <CardDescription>관리자 전용 실시간 분석 페이지</CardDescription>
              <div className="flex items-center justify-center space-x-6 pt-4 text-sm text-gray-500">
                <span className="flex items-center">
                  총 {participantCount}명 참여
                </span>
                <span
                  className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    vote.is_open
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {vote.is_open ? "투표 진행 중" : "투표 종료"}
                </span>
              </div>
            </CardHeader>
          </Card>

          {/* 실시간 분석 결과 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>실시간 결과</CardTitle>
              <CardDescription>
                선택지별 득표수, 비율, 평균 등 상세 분석
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {vote.vote_type === "scale" ? (
                    <div className="p-6">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {scaleAvg !== null ? scaleAvg.toFixed(1) : "0.0"}
                        </div>
                        <div className="text-sm text-gray-600">
                          전체 평균 점수 ({vote.scale_min} - {vote.scale_max})
                        </div>
                      </div>
                      <div className="space-y-2">
                        {scaleOptionStats.map((stat) => (
                          <div
                            key={stat.value}
                            className="flex justify-between items-center border rounded px-3 py-2 bg-gray-50"
                          >
                            <span className="font-medium">{stat.value}점</span>
                            <span className="text-sm text-gray-600">
                              {stat.count}명 ({stat.percentage}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : vote.vote_type === "ranking" ? (
                    rankingResults
                      .filter((r) => r.response_count > 0)
                      .sort(
                        (a, b) =>
                          (a.avg_ranking ?? 999) - (b.avg_ranking ?? 999)
                      )
                      .map((result, index) => (
                        <motion.div
                          key={result.option_id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-lg border border-gray-200"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl font-bold text-blue-600">
                                #{index + 1}
                              </span>
                              <span className="font-medium">
                                {result.option_text}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600">
                              평균 순위:{" "}
                              {result.avg_ranking !== null
                                ? result.avg_ranking.toFixed(1)
                                : "-"}
                            </span>
                          </div>
                        </motion.div>
                      ))
                  ) : (
                    (vote.options || []).map((option) => {
                      const count = getOptionCount(option.id);
                      const percentage =
                        getTotalVotes() > 0
                          ? Math.round((count / getTotalVotes()) * 100)
                          : 0;
                      return (
                        <motion.div
                          key={option.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="p-4 rounded-lg border border-gray-200"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{option.text}</span>
                              {option.image_url && (
                                <span className="text-xs text-gray-500">
                                  [이미지]
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-600">
                              {count}표 ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="bg-blue-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
