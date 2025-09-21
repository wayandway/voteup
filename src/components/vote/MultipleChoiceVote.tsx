"use client";

import { useState } from "react";
import Image from "next/image";
import { Vote } from "@/types/vote";
import { Button, Card, CardContent } from "@/components/ui";
import { Check } from "lucide-react";
import { toast } from "sonner";

interface MultipleChoiceVoteProps {
  vote: Vote;
  onSubmit: (optionIds: string[]) => Promise<void>;
  disabled?: boolean;
  selectedOptions?: string[];
}

export default function MultipleChoiceVote({
  vote,
  onSubmit,
  disabled = false,
  selectedOptions = [],
}: MultipleChoiceVoteProps) {
  const [selected, setSelected] = useState<string[]>(selectedOptions);
  const [submitting, setSubmitting] = useState(false);

  const maxSelections = vote.max_selections || 2;

  const toggleOption = (optionId: string) => {
    if (disabled) return;

    setSelected((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      } else {
        if (prev.length >= maxSelections) {
          toast.error(`최대 ${maxSelections}개까지만 선택할 수 있습니다.`);
          return prev;
        }
        return [...prev, optionId];
      }
    });
  };

  const handleSubmit = async () => {
    if (selected.length === 0 || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit(selected);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          최대 {maxSelections}개까지 선택할 수 있습니다. ({selected.length}/
          {maxSelections} 선택됨)
        </p>
      </div>

      <div className="grid gap-3">
        {vote.options.map((option) => {
          const isSelected = selected.includes(option.id);

          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all duration-200 ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-md hover:border-blue-300"
              } ${
                isSelected
                  ? "ring-2 ring-blue-500 bg-blue-50 border-blue-300"
                  : "border-gray-200"
              }`}
              onClick={() => toggleOption(option.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
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
                      <p className="font-medium text-gray-900">{option.text}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!disabled && (
        <Button
          onClick={handleSubmit}
          disabled={selected.length === 0 || submitting}
          className="w-full"
          size="lg"
        >
          {submitting ? "투표 중..." : `${selected.length}개 선택지로 투표하기`}
        </Button>
      )}
    </div>
  );
}
