"use client";

import Image from "next/image";
import { VoteType, VoteOption, VOTE_TYPE_CONFIGS } from "@/types/vote";
import { Button, Input, Label } from "@/components/ui";
import { Plus, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface VoteOptionsEditorProps {
  voteType: VoteType;
  options: Omit<VoteOption, "id" | "vote_id" | "created_at">[];
  onOptionsChange: (
    options: Omit<VoteOption, "id" | "vote_id" | "created_at">[]
  ) => void;
}

export default function VoteOptionsEditor({
  voteType,
  options,
  onOptionsChange,
}: VoteOptionsEditorProps) {
  const config = VOTE_TYPE_CONFIGS[voteType];

  const addOption = () => {
    if (options.length >= config.maxOptions) {
      toast.error(`최대 ${config.maxOptions}개의 선택지만 추가할 수 있습니다.`);
      return;
    }

    const newOption: Omit<VoteOption, "id" | "vote_id" | "created_at"> = {
      text: "",
      display_order: options.length,
    };

    onOptionsChange([...options, newOption]);
  };

  const removeOption = (index: number) => {
    if (options.length <= config.minOptions) {
      toast.error(`최소 ${config.minOptions}개의 선택지가 필요합니다.`);
      return;
    }

    const newOptions = options.filter((_, i) => i !== index);
    const reorderedOptions = newOptions.map((option, i) => ({
      ...option,
      display_order: i,
    }));

    onOptionsChange(reorderedOptions);
  };

  const updateOption = (index: number, field: string, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onOptionsChange(newOptions);
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      const previewUrl = URL.createObjectURL(file);
      updateOption(index, "image_url", previewUrl);
      updateOption(index, "image_alt", file.name);

      (updateOption as any)(index, "image_file", file);
      toast.success("이미지가 추가되었습니다. 투표 생성 시 업로드됩니다.");
    } catch (error) {
      console.error("이미지 처리 오류:", error);
      toast.error("이미지 처리 중 오류가 발생했습니다.");
    }
  };

  if (voteType === "binary" && options.length === 0) {
    onOptionsChange([
      { text: "옵션 1", display_order: 0 },
      { text: "옵션 2", display_order: 1 },
    ]);
  }

  if (voteType === "scale") {
    return (
      <div className="space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            척도 설정
          </h3>
          <p className="text-sm text-gray-600">
            척도 투표는 숫자 범위에서 값을 선택하는 방식입니다.
          </p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            척도 범위는 투표 설정에서 조정할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          선택지 설정
        </h3>
        <p className="text-sm text-gray-600">{config.description}</p>
      </div>

      <div className="space-y-4">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-4 border rounded-lg"
          >
            <div className="flex-1 space-y-3">
              <div>
                <Label htmlFor={`option-${index}`}>선택지 {index + 1}</Label>
                <Input
                  id={`option-${index}`}
                  placeholder={
                    voteType === "binary"
                      ? index === 0
                        ? "첫 번째 선택지를 입력하세요"
                        : "두 번째 선택지를 입력하세요"
                      : `선택지 ${index + 1}을 입력하세요`
                  }
                  value={option.text}
                  onChange={(e) => updateOption(index, "text", e.target.value)}
                  required
                />
              </div>

              {config.allowImages && (
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm text-gray-600">
                      이미지 업로드 (1MB 이하)
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 1024 * 1024) {
                                toast.error(
                                  "파일이 너무 큽니다. 1MB 이하 파일만 업로드 가능합니다."
                                );
                                return;
                              }
                              handleImageUpload(index, file);
                            }
                          }}
                        />
                        <div className="flex flex-col items-center">
                          <ImageIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            이미지 선택
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {option.image_url && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Image
                        src={option.image_url}
                        alt={option.image_alt || "미리보기"}
                        width={48}
                        height={48}
                        className="object-cover rounded border"
                        onError={() => {
                          toast.error("이미지를 불러올 수 없습니다.");
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          updateOption(index, "image_url", "");
                          updateOption(index, "image_alt", "");
                          (updateOption as any)(index, "image_file", undefined);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {options.length > config.minOptions && voteType !== "binary" && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeOption(index)}
                className="mt-6"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        {options.length < config.maxOptions && voteType !== "binary" && (
          <Button
            type="button"
            variant="outline"
            onClick={addOption}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            선택지 추가
          </Button>
        )}
      </div>

      <div className="text-sm text-gray-500 mt-4">
        {config.minOptions === config.maxOptions
          ? `${config.minOptions}개의 선택지가 필요합니다.`
          : `${config.minOptions}개 이상 ${config.maxOptions}개 이하의 선택지가 필요합니다.`}
      </div>
    </div>
  );
}
