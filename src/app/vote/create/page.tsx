"use client";

import { useState, useEffect } from "react";
import { VoteService } from "@/lib";
import { useAuthStore } from "@/store";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui";
import AvatarMenu from "@/components/layouts/avatar-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  VoteType,
  VoteOption,
  CreateVoteData,
  VOTE_TYPE_CONFIGS,
} from "@/types";
import {
  VoteTypeSelect,
  VoteOptionsEditor,
  VoteSettings,
} from "@/components/vote";

export default function CreateVotePage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [voteType, setVoteType] = useState<VoteType>("single");
  const [options, setOptions] = useState<
    Omit<VoteOption, "id" | "vote_id" | "created_at">[]
  >([
    { text: "", display_order: 0 },
    { text: "", display_order: 1 },
  ]);
  const [maxSelections, setMaxSelections] = useState(2);
  const [scaleMin, setScaleMin] = useState(1);
  const [scaleMax, setScaleMax] = useState(5);
  const [scaleStep, setScaleStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push("/auth/signin");
    }
  }, [user, authLoading, router]);

  const handleVoteTypeChange = (newType: VoteType) => {
    setVoteType(newType);

    const config = VOTE_TYPE_CONFIGS[newType];

    if (newType === "binary") {
      setOptions([
        { text: "옵션 1", display_order: 0 },
        { text: "옵션 2", display_order: 1 },
      ]);
    } else if (newType === "scale") {
      setOptions([{ text: "척도 선택", display_order: 0 }]);
    } else {
      setOptions(
        Array.from({ length: config.minOptions }, (_, i) => ({
          text: "",
          display_order: i,
        }))
      );
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("투표 제목을 입력해주세요.");
      return false;
    }

    const config = VOTE_TYPE_CONFIGS[voteType];

    // 옵션 개수 및 텍스트 검사 (scale 제외)
    if (voteType !== "scale") {
      const validOptions = options.filter(
        (option) => option.text.trim() !== ""
      );
      if (validOptions.length < config.minOptions) {
        toast.error(`최소 ${config.minOptions}개의 선택지를 입력해주세요.`);
        return false;
      }
      if (validOptions.length > config.maxOptions) {
        toast.error(
          `최대 ${config.maxOptions}개의 선택지만 입력할 수 있습니다.`
        );
        return false;
      }
      if (voteType === "binary" && validOptions.length !== 2) {
        toast.error("이분 투표는 반드시 2개의 선택지가 필요합니다.");
        return false;
      }
      // 선택지 텍스트 중복 검사
      const texts = validOptions.map((option) => option.text.trim());
      const uniqueTexts = new Set(texts);
      if (uniqueTexts.size !== texts.length) {
        toast.error("선택지 내용은 모두 달라야 합니다.");
        return false;
      }
    }

    // 복수 선택 투표: maxSelections 검사
    if (voteType === "multiple") {
      if (maxSelections < 2) {
        toast.error("복수 선택 투표는 최소 2개 이상 선택할 수 있어야 합니다.");
        return false;
      }
      if (maxSelections > options.length) {
        toast.error("최대 선택 개수는 선택지 개수 이하여야 합니다.");
        return false;
      }
    }

    // 척도 투표: 범위 및 스텝 검사
    if (voteType === "scale") {
      if (scaleMin >= scaleMax) {
        toast.error("최솟값은 최댓값보다 작아야 합니다.");
        return false;
      }
      if (scaleStep <= 0) {
        toast.error("척도 단위는 1 이상이어야 합니다.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const voteData: CreateVoteData = {
        title: title.trim(),
        description: description.trim() || undefined,
        vote_type: voteType,
        expires_at: undefined,
        options: [],
      };

      if (voteType !== "scale") {
        const validOptions = options.filter(
          (option) => option.text.trim() !== ""
        );
        voteData.options = validOptions.map((option, index) => ({
          text: option.text.trim(),
          image_alt: option.image_alt || undefined,
          image_file: (option as any).image_file || undefined, // 파일 객체 포함
          display_order: index,
        }));
      } else {
        voteData.options = [
          {
            text: "척도 선택",
            display_order: 0,
          },
        ];
      }

      if (voteType === "multiple") {
        voteData.max_selections = maxSelections;
      } else if (voteType === "scale") {
        voteData.scale_min = scaleMin;
        voteData.scale_max = scaleMax;
        voteData.scale_step = scaleStep;
      }

      const vote = await VoteService.createVote(voteData);

      toast.success("투표가 성공적으로 생성되었습니다!");
      router.push(`/vote/${vote.id}`);
    } catch (error) {
      console.error("투표 생성 오류:", error);
      toast.error("투표 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--stone-100)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--stone-100)] pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-gray-700"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span className="text-base text-gray-700 font-medium">
                돌아가기
              </span>
            </Link>
            <div className="flex-shrink-0">
              <AvatarMenu />
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">투표 생성</h2>
            <p className="text-gray-600">새로운 투표를 생성하세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 기본 정보 */}
            <Card>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">투표 제목 *</Label>
                  <Input
                    id="title"
                    placeholder="예: 다음 주 회의 시간은?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">설명 (선택)</Label>
                  <Input
                    id="description"
                    placeholder="투표에 대한 추가 설명을 입력하세요"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 투표 유형 선택 */}
            <Card>
              <CardContent>
                <VoteTypeSelect
                  selectedType={voteType}
                  onTypeChange={handleVoteTypeChange}
                />
              </CardContent>
            </Card>

            {/* 선택지 설정 */}
            {voteType !== "scale" && (
              <Card>
                <CardContent>
                  <VoteOptionsEditor
                    voteType={voteType}
                    options={options}
                    onOptionsChange={setOptions}
                  />
                </CardContent>
              </Card>
            )}

            {/* 투표 설정 */}
            {VOTE_TYPE_CONFIGS[voteType].hasSettings && (
              <Card>
                <CardContent>
                  <VoteSettings
                    voteType={voteType}
                    maxSelections={maxSelections}
                    scaleMin={scaleMin}
                    scaleMax={scaleMax}
                    scaleStep={scaleStep}
                    onMaxSelectionsChange={setMaxSelections}
                    onScaleMinChange={setScaleMin}
                    onScaleMaxChange={setScaleMax}
                    onScaleStepChange={setScaleStep}
                  />
                </CardContent>
              </Card>
            )}

            {/* 액션 버튼 */}
            <div className="flex space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setTitle("");
                  setDescription("");
                  setVoteType("single");
                  setOptions([
                    { text: "", display_order: 0 },
                    { text: "", display_order: 1 },
                  ]);
                  setMaxSelections(2);
                  setScaleMin(1);
                  setScaleMax(5);
                  setScaleStep(1);
                }}
              >
                초기화
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "생성 중..." : "만들기"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
