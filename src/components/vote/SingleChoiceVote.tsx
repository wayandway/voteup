"use client";

import { useState } from "react";
import Image from "next/image";
import { Vote } from "@/types";
import { Button, Card, CardContent } from "@/components/ui";
import { Check } from "lucide-react";

interface SingleChoiceVoteProps {
  vote: Vote;
  onSubmit: (optionId: string) => Promise<void>;
  disabled?: boolean;
  selectedOption?: string;
}

export default function SingleChoiceVote({
  vote,
  onSubmit,
  disabled = false,
  selectedOption,
}: SingleChoiceVoteProps) {
  const [selected, setSelected] = useState<string>(selectedOption || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selected || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit(selected);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {vote.options.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all duration-200 ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-md hover:border-blue-300"
            } ${
              selected === option.id
                ? "ring-2 ring-blue-500 bg-blue-50 border-blue-300"
                : "border-gray-200"
            }`}
            onClick={() => !disabled && setSelected(option.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {option.image_url && (
                    <Image
                      src={option.image_url}
                      alt={option.image_alt || option.text}
                      width={80}
                      height={80}
                      className="object-cover rounded-lg border"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{option.text}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selected === option.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selected === option.id && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!disabled && (
        <Button
          onClick={handleSubmit}
          disabled={!selected || submitting}
          className="w-full"
          size="lg"
        >
          {submitting ? "투표 중..." : "투표하기"}
        </Button>
      )}
    </div>
  );
}
