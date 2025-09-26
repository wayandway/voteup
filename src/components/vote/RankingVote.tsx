"use client";

import { useState } from "react";
import Image from "next/image";
import { Vote } from "@/types/vote";
import { Button, Card, CardContent } from "@/components/ui";

interface RankingVoteProps {
  vote: Vote;
  onSubmit: (rankings: { optionId: string; rank: number }[]) => Promise<void>;
  disabled?: boolean;
  selectedRankings?: { optionId: string; rank: number }[];
}

export default function RankingVote({
  vote,
  onSubmit,
  disabled = false,
  selectedRankings = [],
}: RankingVoteProps) {
  const [rankings, setRankings] = useState<
    { optionId: string; rank: number }[]
  >(() => {
    if (selectedRankings.length > 0) {
      return selectedRankings.sort((a, b) => a.rank - b.rank);
    }
    return [];
  });
  const [submitting, setSubmitting] = useState(false);

  const handleOptionClick = (optionId: string) => {
    if (disabled) return;

    const existingRank = rankings.find((r) => r.optionId === optionId);

    if (existingRank) {
      setRankings((prev) =>
        prev
          .filter((r) => r.optionId !== optionId)
          .map((r) =>
            r.rank > existingRank.rank ? { ...r, rank: r.rank - 1 } : r
          )
      );
    } else {
      const nextRank = rankings.length + 1;
      setRankings((prev) => [...prev, { optionId, rank: nextRank }]);
    }
  };

  const getRankForOption = (optionId: string) => {
    return rankings.find((r) => r.optionId === optionId)?.rank;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (rankings.length !== vote.options.length) {
      alert("모든 선택지에 순위를 지정해야 합니다.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(rankings);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">순위 투표 방법</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. 선택지를 클릭하여 순위를 매기세요</li>
          <li>2. 클릭한 순서대로 순위가 정해집니다</li>
          <li>3. 다시 클릭하면 순위에서 제거됩니다</li>
        </ol>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">
          선택지 (클릭하여 순위 매기기)
        </h4>
        <div className="space-y-2">
          {vote.options.map((option) => {
            const rank = getRankForOption(option.id);
            const isSelected = rank !== undefined;

            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => handleOptionClick(option.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                          isSelected
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {isSelected ? rank : "?"}
                      </div>

                      {option.image_url && (
                        <Image
                          src={option.image_url}
                          alt={option.image_alt || option.text}
                          width={48}
                          height={48}
                          className="object-cover rounded-lg"
                        />
                      )}

                      <div>
                        <p className="font-medium text-gray-900">
                          {option.text}
                        </p>
                        {isSelected && (
                          <p className="text-sm text-blue-600">
                            {rank}순위로 선택됨
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSubmit}
          disabled={rankings.length !== vote.options.length || submitting}
          className="w-full max-w-md"
        >
          {submitting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>제출 중...</span>
            </div>
          ) : (
            `순위 투표 제출 (${rankings.length}/${vote.options.length}개 순위 지정)`
          )}
        </Button>
      </div>
    </div>
  );
}
