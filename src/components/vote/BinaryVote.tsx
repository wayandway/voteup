"use client";

import { useState } from "react";
import Image from "next/image";
import { Vote } from "@/types";
import { Button, Card, CardContent } from "@/components/ui";

interface BinaryVoteProps {
  vote: Vote;
  onSubmit: (optionId: string) => Promise<void>;
  disabled?: boolean;
  selectedOption?: string;
}

export default function BinaryVote({
  vote,
  onSubmit,
  disabled = false,
  selectedOption,
}: BinaryVoteProps) {
  const [selected, setSelected] = useState<string>(selectedOption || "");
  const [submitting, setSubmitting] = useState(false);

  const yesOption = vote.options.find((opt) => opt.display_order === 0);
  const noOption = vote.options.find((opt) => opt.display_order === 1);

  const handleSubmit = async () => {
    if (!selected || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit(selected);
    } finally {
      setSubmitting(false);
    }
  };

  if (!yesOption || !noOption) {
    return (
      <div className="text-center p-8 text-gray-500">
        투표 옵션을 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className={`cursor-pointer transition-all duration-200 ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-lg hover:scale-105"
          } ${
            selected === yesOption.id
              ? "ring-2 ring-blue-500 bg-blue-50 border-blue-300"
              : "border-gray-200 hover:border-blue-300"
          }`}
          onClick={() => !disabled && setSelected(yesOption.id)}
        >
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              {yesOption.image_url ? (
                <Image
                  src={yesOption.image_url}
                  alt={yesOption.image_alt || yesOption.text}
                  width={80}
                  height={80}
                  className="mx-auto object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-blue-200 rounded-full"></div>
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-blue-700">
                  {yesOption.text}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all duration-200 ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-lg hover:scale-105"
          } ${
            selected === noOption.id
              ? "ring-2 ring-orange-500 bg-orange-50 border-orange-300"
              : "border-gray-200 hover:border-orange-300"
          }`}
          onClick={() => !disabled && setSelected(noOption.id)}
        >
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              {noOption.image_url ? (
                <Image
                  src={noOption.image_url}
                  alt={noOption.image_alt || noOption.text}
                  width={80}
                  height={80}
                  className="mx-auto object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-orange-200 rounded-full"></div>
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-orange-700">
                  {noOption.text}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!disabled && (
        <Button
          onClick={handleSubmit}
          disabled={!selected || submitting}
          className={`w-full text-lg py-6 ${
            selected === yesOption.id
              ? "bg-blue-600 hover:bg-blue-700"
              : selected === noOption.id
              ? "bg-orange-600 hover:bg-orange-700"
              : ""
          }`}
          size="lg"
        >
          {submitting
            ? "투표 중..."
            : selected
            ? selected === yesOption.id
              ? `"${yesOption.text}" 투표하기`
              : `"${noOption.text}" 투표하기`
            : "선택지를 선택해주세요"}
        </Button>
      )}
    </div>
  );
}
