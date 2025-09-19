"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
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
import { Vote, Plus, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

export default function CreatePollPage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 인증 상태 로딩 중이면 대기
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    } else {
      toast.error("최대 10개의 선택지만 추가할 수 있습니다.");
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    } else {
      toast.error("최소 2개의 선택지가 필요합니다.");
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (title.trim() === "") {
      toast.error("투표 제목을 입력해주세요.");
      return;
    }

    const validOptions = options.filter((option) => option.trim() !== "");
    if (validOptions.length < 2) {
      toast.error("최소 2개의 선택지를 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      // 투표 생성
      const { data: pollData, error: pollError } = await (supabase as any)
        .from("polls")
        .insert({
          host_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          is_open: false,
        })
        .select()
        .single();

      if (pollError) {
        toast.error("투표 생성 실패: " + pollError.message);
        return;
      }

      // 선택지 생성
      const optionsData = validOptions.map((option) => ({
        poll_id: pollData.id,
        label: option.trim(),
        count: 0,
      }));

      const { error: optionsError } = await (supabase as any)
        .from("options")
        .insert(optionsData);

      if (optionsError) {
        toast.error("선택지 생성 실패: " + optionsError.message);
        return;
      }

      toast.success("투표가 성공적으로 생성되었습니다!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("투표 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 인증 상태 로딩 중
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Vote className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">VoteUP</h1>
          </Link>

          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              대시보드
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              새 투표 만들기
            </h2>
            <p className="text-gray-600">
              참가자들이 참여할 수 있는 투표를 생성하세요.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>투표 정보</CardTitle>
              <CardDescription>
                투표 제목과 설명, 선택지를 입력해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="description">설명 (선택사항)</Label>
                  <Input
                    id="description"
                    placeholder="투표에 대한 추가 설명을 입력하세요"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <Label>선택지 *</Label>
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder={`선택지 ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        required
                      />
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeOption(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  {options.length < 10 && (
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

                <div className="flex space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <Link href="/dashboard">취소</Link>
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "생성 중..." : "투표 생성"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
