"use client";

import { VoteType, VOTE_TYPE_CONFIGS } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import {
  CircleDot,
  CheckSquare,
  BarChart3,
  GitBranch,
  Ruler,
} from "lucide-react";

const iconComponents = {
  CircleDot,
  CheckSquare,
  BarChart3,
  GitBranch,
  Ruler,
};

interface VoteTypeSelectProps {
  selectedType: VoteType;
  onTypeChange: (type: VoteType) => void;
}

export default function VoteTypeSelect({
  selectedType,
  onTypeChange,
}: VoteTypeSelectProps) {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          투표 유형 선택
        </h3>
        <p className="text-sm text-gray-600">
          어떤 방식으로 투표를 진행할지 선택해주세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(VOTE_TYPE_CONFIGS).map(([type, config]) => {
          const IconComponent =
            iconComponents[config.iconComponent as keyof typeof iconComponents];

          return (
            <Card
              key={type}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedType === type
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => onTypeChange(type as VoteType)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-gray-800" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{config.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm">
                  {config.description}
                </CardDescription>
                <div className="mt-2 text-xs text-gray-500">
                  {config.minOptions === config.maxOptions
                    ? `${config.minOptions}개 선택지`
                    : `${config.minOptions}-${config.maxOptions}개 선택지`}
                  {config.allowImages && " • 이미지 지원"}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
