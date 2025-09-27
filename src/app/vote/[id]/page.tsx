"use client";

import { useEffect, useState, useCallback } from "react";
import {
  VoteService,
  canVote,
  markAsVoted,
  generateParticipantToken,
} from "@/lib";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Vote, Users, Clock, CheckCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import type { Vote as VoteType, VoteResponse } from "@/types";
import {
  SingleChoiceVote,
  MultipleChoiceVote,
  RankingVote,
  BinaryVote,
  ScaleVote,
} from "@/components/vote";

export default function VotePage() {
  const params = useParams();
  const voteId = params.id as string;
  const [vote, setVote] = useState<VoteType | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [participantToken, setParticipantToken] = useState<string | null>(null);

  // participantToken을 voteId별로 localStorage에 저장 및 재사용
  useEffect(() => {
    if (!voteId) return;
    let token = localStorage.getItem(`participantToken:${voteId}`);
    if (!token) {
      token = generateParticipantToken();
      localStorage.setItem(`participantToken:${voteId}`, token);
    }
    setParticipantToken(token);
  }, [voteId]);
  const [existingResponse, setExistingResponse] = useState<VoteResponse[]>([]);
  const [voteResults, setVoteResults] = useState<any[]>([]);
  const [participantCount, setParticipantCount] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchVoteResults = useCallback(
    async (voteData?: VoteType | null) => {
      const currentVote = voteData || vote;
      if (!voteId || !currentVote) return;

      try {
        const results: any[] = await VoteService.getVoteResults(voteId);

        if (currentVote.vote_type === "ranking") {
          const processedResults = currentVote.options.map((option) => {
            const optionResponses = results.filter(
              (r: any) => r.option_id === option.id
            );
            const rankings = optionResponses
              .map((r: any) => r.ranking)
              .filter((r: any) => r !== null);
            const avgRanking =
              rankings.length > 0
                ? rankings.reduce(
                    (sum: number, rank: number) => sum + rank,
                    0
                  ) / rankings.length
                : null;

            return {
              option_id: option.id,
              option_text: option.text,
              response_count: optionResponses.length,
              avg_ranking: avgRanking,
            };
          });

          setVoteResults(processedResults);
        } else if (currentVote.vote_type === "scale") {
          const scaleValues = results
            .map((r: any) => r.scale_value)
            .filter((v: any) => v !== null);
          const avgScore =
            scaleValues.length > 0
              ? scaleValues.reduce((sum: number, val: number) => sum + val, 0) /
                scaleValues.length
              : null;

          setVoteResults([
            {
              avg_score: avgScore,
              response_count: scaleValues.length,
            },
          ]);
        } else {
          const processedResults = currentVote.options.map((option) => {
            const optionResponses = results.filter(
              (r: any) => r.option_id === option.id
            );

            return {
              option_id: option.id,
              option_text: option.text,
              response_count: optionResponses.length,
            };
          });
          setVoteResults(processedResults);
        }
      } catch (error) {
        toast.error("투표 결과를 불러오지 못했습니다.");
      }
    },
    [voteId, vote]
  );

  useEffect(() => {
    if (vote?.id) {
      fetchVoteResults();
    }
  }, [vote?.id]);

  const fetchVote = useCallback(async () => {
    if (!participantToken) return;
    setLoading(true);
    try {
      const voteData = await VoteService.getVoteById(voteId);
      setVote(voteData);
      setParticipantCount(voteData.participant_count || 0);

      // 전체 응답 중 내 participant_token에 해당하는 것만 추출
      const allResponses = await VoteService.getVoteResults(voteId);
      const myResponses = allResponses.filter(
        (r) => r.participant_token === participantToken
      );
      if (myResponses.length > 0) {
        setHasVoted(true);
        setExistingResponse(myResponses);
        markAsVoted(voteId);
      } else if (!canVote(voteId)) {
        setHasVoted(true);
      }
    } catch (error: any) {
      console.error("투표 조회 실패:", error);
      toast.error(error.message || "투표를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [voteId, participantToken]);

  useEffect(() => {
    if (voteId && participantToken) {
      fetchVote();
      setHasVoted(!canVote(voteId));

      // 실시간 구독 콜백에서는 fetchVoteResults만 호출 (상태 루프 차단)
      const subscription = VoteService.subscribeToVoteUpdates(voteId, () => {
        fetchVoteResults();
      });

      return () => {
        VoteService.unsubscribeFromVoteUpdates(subscription);
      };
    }
  }, [voteId, participantToken]);

  const handleVoteSubmit = async (
    responses: Array<{
      optionId?: string;
      scaleValue?: number;
      ranking?: number;
    }>
  ) => {
    if (!vote || !vote.is_open) {
      toast.error("투표가 종료되었습니다.");
      return;
    }
    if (!participantToken) {
      toast.error("참여 토큰이 없습니다.");
      return;
    }

    setVoting(true);
    try {
      await VoteService.submitVoteResponse(voteId, participantToken, responses);

      markAsVoted(voteId);
      setHasVoted(true);
      toast.success("투표가 완료되었습니다!");

      fetchVote();
      fetchVoteResults();
    } catch (error: any) {
      toast.error(error.message || "투표 중 오류가 발생했습니다.");
    } finally {
      setVoting(false);
    }
  };

  const renderVoteComponent = () => {
    if (!vote) return null;

    const getSelectedOption = () => {
      if (existingResponse.length > 0) {
        return existingResponse[0]?.option_id || "";
      }
      return "";
    };

    const handleSingleSubmit = async (optionId: string) => {
      await handleVoteSubmit([{ optionId }]);
    };

    const handleMultipleSubmit = async (optionIds: string[]) => {
      await handleVoteSubmit(optionIds.map((id) => ({ optionId: id })));
    };

    const handleRankingSubmit = async (
      rankings: Array<{ optionId: string; rank: number }>
    ) => {
      await handleVoteSubmit(
        rankings.map((r) => ({ optionId: r.optionId, ranking: r.rank }))
      );
    };

    const handleYesNoSubmit = async (optionId: string) => {
      await handleVoteSubmit([{ optionId }]);
    };

    const handleScaleSubmit = async (value: number) => {
      await handleVoteSubmit([{ scaleValue: value }]);
    };

    switch (vote.vote_type) {
      case "single":
        return (
          <SingleChoiceVote
            vote={vote}
            onSubmit={handleSingleSubmit}
            disabled={!vote.is_open || hasVoted || voting}
            selectedOption={getSelectedOption()}
          />
        );
      case "multiple":
        return (
          <MultipleChoiceVote
            vote={vote}
            onSubmit={handleMultipleSubmit}
            disabled={!vote.is_open || hasVoted || voting}
            selectedOptions={
              existingResponse
                .map((r) => r.option_id)
                .filter(Boolean) as string[]
            }
          />
        );
      case "ranking":
        return (
          <RankingVote
            vote={vote}
            onSubmit={handleRankingSubmit}
            disabled={!vote.is_open || hasVoted || voting}
            selectedRankings={existingResponse.map((r) => ({
              optionId: r.option_id!,
              rank: r.ranking!,
            }))}
          />
        );
      case "binary":
        return (
          <BinaryVote
            vote={vote}
            onSubmit={handleYesNoSubmit}
            disabled={!vote.is_open || hasVoted || voting}
            selectedOption={getSelectedOption()}
          />
        );
      case "scale":
        return (
          <ScaleVote
            vote={vote}
            onSubmit={handleScaleSubmit}
            disabled={!vote.is_open || hasVoted || voting}
            selectedValue={existingResponse[0]?.scale_value}
          />
        );
      default:
        return <div>지원하지 않는 투표 유형입니다.</div>;
    }
  };

  const getTotalVotes = () => {
    if (vote?.vote_type === "scale") {
      return voteResults[0]?.response_count || 0;
    }
    return voteResults.reduce(
      (sum, result) => sum + (result.response_count || 0),
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--stone-100)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">투표를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!vote) {
    return (
      <div className="min-h-screen bg-[var(--stone-100)] flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <Vote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              투표를 찾을 수 없습니다
            </h2>
            <p className="text-gray-600">
              유효하지 않은 투표 링크이거나 삭제된 투표입니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--stone-100)] pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{vote.title}</CardTitle>
              {vote.description && (
                <CardDescription className="text-base">
                  {vote.description}
                </CardDescription>
              )}

              <div className="flex items-center justify-center space-x-6 pt-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {participantCount}명 참여
                </span>
                <span
                  className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    vote.is_open
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {vote.is_open ? "투표 진행 중" : "투표 종료"}
                </span>
              </div>
            </CardHeader>
          </Card>

          {!vote.is_open ? (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  투표가 종료되었습니다
                </h3>
                <p className="text-gray-600 mb-6">
                  아래에서 최종 결과를 확인하실 수 있습니다.
                </p>
              </CardContent>
            </Card>
          ) : hasVoted ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  투표가 완료되었습니다!
                </h3>
                <p className="text-gray-600 mb-6">
                  참여해주셔서 감사합니다. 실시간 결과를 확인해보세요.
                </p>
                <div className="mt-6 text-left max-w-md mx-auto">
                  <div className="font-semibold mb-2 text-gray-800">
                    내가 제출한 답변
                  </div>
                  {existingResponse.length > 0 ? (
                    <div>{renderVoteComponent()}</div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      투표 응답을 불러올 수 없습니다.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>투표해주세요</CardTitle>
                <CardDescription>
                  {vote.vote_type === "single" && "하나의 선택지를 선택하세요."}
                  {vote.vote_type === "multiple" &&
                    `최대 ${vote.max_selections}개까지 선택할 수 있습니다.`}
                  {vote.vote_type === "ranking" &&
                    "선택지를 순서대로 정렬해주세요."}
                  {vote.vote_type === "binary" &&
                    "찬성 또는 반대를 선택해주세요."}
                  {vote.vote_type === "scale" &&
                    `${vote.scale_min}점부터 ${vote.scale_max}점까지 평가해주세요.`}
                </CardDescription>
              </CardHeader>
              <CardContent>{renderVoteComponent()}</CardContent>
            </Card>
          )}

          {/* 실시간 결과 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>실시간 결과</CardTitle>
              <CardDescription>
                총 {getTotalVotes()}명이 참여했습니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {vote.vote_type === "scale" ? (
                    <div className="text-center p-6">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {voteResults.length > 0
                          ? voteResults[0]?.avg_score?.toFixed(1) || "0.0"
                          : "0.0"}
                      </div>
                      <div className="text-sm text-gray-600">
                        평균 점수 ({vote.scale_min} - {vote.scale_max})
                      </div>
                    </div>
                  ) : vote.vote_type === "ranking" ? (
                    voteResults
                      .sort(
                        (a, b) =>
                          (a.avg_ranking || 999) - (b.avg_ranking || 999)
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
                              {result.avg_ranking
                                ? result.avg_ranking.toFixed(1)
                                : result.response_count > 0
                                ? "순위 없음"
                                : "투표 없음"}
                            </span>
                          </div>
                        </motion.div>
                      ))
                  ) : (
                    voteResults.map((result) => {
                      const percentage =
                        getTotalVotes() > 0
                          ? Math.round(
                              (result.response_count / getTotalVotes()) * 100
                            )
                          : 0;

                      return (
                        <motion.div
                          key={result.option_id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="p-4 rounded-lg border border-gray-200"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {result.option_text}
                              </span>
                              {result.image_url && (
                                <span className="text-xs text-gray-500">
                                  [이미지]
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-600">
                              {result.response_count}표 ({percentage}%)
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
