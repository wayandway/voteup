"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Vote, Users, Clock, CheckCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  canVote,
  markAsVoted,
  generateParticipantToken,
} from "@/lib/vote-utils";
import { motion, AnimatePresence } from "framer-motion";

interface Poll {
  id: string;
  title: string;
  description?: string;
  is_open: boolean;
  created_at: string;
  options: Option[];
}

interface Option {
  id: string;
  poll_id: string;
  label: string;
  count: number;
}

export default function VotePage() {
  const params = useParams();
  const pollId = params.id as string;
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const supabase = createClient();

  const fetchPoll = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("polls")
        .select(
          `
          *,
          options (*)
        `
        )
        .eq("id", pollId)
        .single();

      if (error) {
        toast.error("투표를 찾을 수 없습니다.");
      } else {
        setPoll(data);
      }
    } catch {
      toast.error("투표를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [pollId, supabase]);

  useEffect(() => {
    if (pollId) {
      fetchPoll();
      setHasVoted(!canVote(pollId));

      // 실시간 업데이트 구독
      const subscription = supabase
        .channel(`poll_${pollId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "options",
            filter: `poll_id=eq.${pollId}`,
          },
          (payload) => {
            setPoll((currentPoll) => {
              if (currentPoll) {
                const updatedOptions = currentPoll.options.map((option) =>
                  option.id === payload.new.id
                    ? { ...option, count: payload.new.count }
                    : option
                );
                return { ...currentPoll, options: updatedOptions };
              }
              return currentPoll;
            });
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [pollId, fetchPoll, supabase]);

  const handleVote = async (optionId: string) => {
    if (!poll || !poll.is_open || hasVoted) {
      return;
    }

    setVoting(true);
    const participantToken = generateParticipantToken();
    const supabase = createClient();

    try {
      // 투표 기록 추가
      const { error: responseError } = await (supabase as any)
        .from("responses")
        .insert({
          poll_id: pollId,
          option_id: optionId,
          participant_token: participantToken,
        });

      if (responseError) {
        toast.error("투표 실패: " + responseError.message);
        return;
      }

      // 선택지 카운트 업데이트
      const selectedOptionData = poll.options.find(
        (opt) => opt.id === optionId
      );
      if (selectedOptionData) {
        const { error: updateError } = await (supabase as any)
          .from("options")
          .update({ count: selectedOptionData.count + 1 })
          .eq("id", optionId);

        if (updateError) {
          toast.error("투표 집계 실패");
          return;
        }
      }

      // 로컬 상태 업데이트
      markAsVoted(pollId);
      setHasVoted(true);
      setSelectedOption(optionId);
      toast.success("투표가 완료되었습니다!");
    } catch {
      toast.error("투표 중 오류가 발생했습니다.");
    } finally {
      setVoting(false);
    }
  };

  const getTotalVotes = () => {
    return poll?.options.reduce((sum, option) => sum + option.count, 0) || 0;
  };

  const getPercentage = (count: number) => {
    const total = getTotalVotes();
    return total > 0 ? Math.round((count / total) * 100) : 0;
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

  if (!poll) {
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
              <CardTitle className="text-2xl">{poll.title}</CardTitle>
              {poll.description && (
                <CardDescription className="text-base">
                  {poll.description}
                </CardDescription>
              )}

              <div className="flex items-center justify-center space-x-6 pt-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {getTotalVotes()} 참가자
                </span>
                <span
                  className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    poll.is_open
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {poll.is_open ? "투표 진행 중" : "투표 종료"}
                </span>
              </div>
            </CardHeader>
          </Card>

          {!poll.is_open ? (
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
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>투표해주세요</CardTitle>
                <CardDescription>
                  하나의 선택지를 선택하세요. 투표는 한 번만 가능합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {poll.options.map((option) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      className="w-full h-auto p-4 text-left justify-start hover:bg-blue-50"
                      onClick={() => handleVote(option.id)}
                      disabled={voting}
                    >
                      <span className="text-base">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
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
                  {poll.options.map((option) => {
                    const percentage = getPercentage(option.count);
                    const isSelected = selectedOption === option.id;

                    return (
                      <motion.div
                        key={option.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 rounded-lg border ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-sm text-gray-600">
                            {option.count}표 ({percentage}%)
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
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
