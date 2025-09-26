"use client";

import { VoteType, VOTE_TYPE_CONFIGS } from "@/types";
import { Label, Input } from "@/components/ui";

interface VoteSettingsProps {
  voteType: VoteType;
  maxSelections?: number;
  scaleMin?: number;
  scaleMax?: number;
  scaleStep?: number;
  onMaxSelectionsChange: (value: number) => void;
  onScaleMinChange: (value: number) => void;
  onScaleMaxChange: (value: number) => void;
  onScaleStepChange: (value: number) => void;
}

export default function VoteSettings({
  voteType,
  maxSelections = 2,
  scaleMin = 1,
  scaleMax = 5,
  scaleStep = 1,
  onMaxSelectionsChange,
  onScaleMinChange,
  onScaleMaxChange,
  onScaleStepChange,
}: VoteSettingsProps) {
  const config = VOTE_TYPE_CONFIGS[voteType];

  if (!config.hasSettings) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">투표 설정</h3>
        <p className="text-sm text-gray-600">
          투표 유형에 따른 추가 설정을 조정할 수 있습니다.
        </p>
      </div>

      {voteType === "multiple" && (
        <div className="space-y-3">
          <Label htmlFor="max-selections">최대 선택 가능 개수</Label>
          <div className="space-y-2">
            <Input
              id="max-selections"
              type="number"
              min="1"
              max="10"
              value={maxSelections}
              onChange={(e) =>
                onMaxSelectionsChange(parseInt(e.target.value) || 2)
              }
              className="w-32"
            />
            <p className="text-sm text-gray-500">
              참가자가 선택할 수 있는 최대 선택지 개수입니다.
            </p>
          </div>
        </div>
      )}

      {voteType === "scale" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="scale-min">최솟값</Label>
              <Input
                id="scale-min"
                type="number"
                value={scaleMin}
                onChange={(e) =>
                  onScaleMinChange(parseInt(e.target.value) || 1)
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="scale-max">최댓값</Label>
              <Input
                id="scale-max"
                type="number"
                min={scaleMin + 1}
                value={scaleMax}
                onChange={(e) =>
                  onScaleMaxChange(parseInt(e.target.value) || 5)
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="scale-step">단계</Label>
              <Input
                id="scale-step"
                type="number"
                min="0.1"
                step="0.1"
                value={scaleStep}
                onChange={(e) =>
                  onScaleStepChange(parseFloat(e.target.value) || 1)
                }
                className="mt-1"
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">미리보기</h4>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{scaleMin}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                <div className="absolute inset-0 flex items-center justify-between px-2">
                  {Array.from(
                    {
                      length: Math.floor((scaleMax - scaleMin) / scaleStep) + 1,
                    },
                    (_, i) => (
                      <div
                        key={i}
                        className="w-1 h-4 bg-gray-400 rounded"
                      ></div>
                    )
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-600">{scaleMax}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {scaleMin}부터 {scaleMax}까지, {scaleStep} 단위로 선택 가능
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
