"use client";

import { useState } from "react";
import { Vote } from "@/types";
import { Button, Card, CardContent, Label } from "@/components/ui";
import { Slider } from "@/components/ui/slider";

interface ScaleVoteProps {
  vote: Vote;
  onSubmit: (value: number) => Promise<void>;
  disabled?: boolean;
  selectedValue?: number;
}

export default function ScaleVote({
  vote,
  onSubmit,
  disabled = false,
  selectedValue,
}: ScaleVoteProps) {
  const scaleMin = vote.scale_min || 1;
  const scaleMax = vote.scale_max || 5;
  const scaleStep = vote.scale_step || 1;

  const [value, setValue] = useState<number>(selectedValue || scaleMin);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);
    try {
      await onSubmit(value);
    } finally {
      setSubmitting(false);
    }
  };

  const getScaleLabel = (val: number) => {
    const range = scaleMax - scaleMin;
    const position = (val - scaleMin) / range;

    if (range === 4) {
      const labels = ["매우 낮음", "낮음", "보통", "높음", "매우 높음"];
      return labels[Math.round(position * 4)];
    } else if (range === 9) {
      if (val <= 2) return "매우 낮음";
      if (val <= 4) return "낮음";
      if (val <= 6) return "보통";
      if (val <= 8) return "높음";
      return "매우 높음";
    } else {
      if (position <= 0.2) return "매우 낮음";
      if (position <= 0.4) return "낮음";
      if (position <= 0.6) return "보통";
      if (position <= 0.8) return "높음";
      return "매우 높음";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                현재 선택: {value}
              </h3>
              <p className="text-lg text-blue-700 font-medium">
                {getScaleLabel(value)}
              </p>
            </div>

            <div className="space-y-4">
              <Label className="block text-sm font-medium text-gray-700">
                {scaleMin}부터 {scaleMax}까지의 척도에서 선택해주세요
              </Label>

              <div className="px-4">
                <Slider
                  value={[value]}
                  onValueChange={(values) => setValue(values[0])}
                  min={scaleMin}
                  max={scaleMax}
                  step={scaleStep}
                  disabled={disabled}
                  className="w-full"
                />
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <span>{scaleMin}</span>
                <span>{Math.round((scaleMin + scaleMax) / 2)}</span>
                <span>{scaleMax}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {Array.from({ length: 5 }, (_, i) => {
          const labels = ["매우 낮음", "낮음", "보통", "높음", "매우 높음"];
          const colors = [
            "bg-red-100 text-red-700 border-red-200",
            "bg-orange-100 text-orange-700 border-orange-200",
            "bg-yellow-100 text-yellow-700 border-yellow-200",
            "bg-blue-100 text-blue-700 border-blue-200",
            "bg-green-100 text-green-700 border-green-200",
          ];

          const currentLabel = getScaleLabel(value);
          const isActive = currentLabel === labels[i];

          return (
            <div
              key={i}
              className={`p-3 rounded-lg border text-center text-sm font-medium transition-all ${
                isActive
                  ? `${colors[i]} ring-2 ring-offset-1 ring-gray-400`
                  : "bg-gray-50 text-gray-500 border-gray-200"
              }`}
            >
              {labels[i]}
            </div>
          );
        })}
      </div>

      {!disabled && (
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full"
          size="lg"
        >
          {submitting ? "투표 중..." : `${value}점으로 투표하기`}
        </Button>
      )}
    </div>
  );
}
