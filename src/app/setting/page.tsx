"use client";

import { useState, useEffect } from "react";
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
import { User, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SettingPage() {
  const {
    user,
    userProfile,
    setUserProfile,
    loading: authLoading,
  } = useAuthStore();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (userProfile) {
      setUsername(userProfile.username || "");
    }
  }, [user, userProfile, authLoading]); // router 제거

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (username.trim().length < 2) {
      toast.error("사용자명은 최소 2자 이상이어야 합니다.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          email: user.email!,
          username: username.trim(),
        })
        .select()
        .single();

      if (error) {
        toast.error("프로필 업데이트 실패: " + error.message);
      } else {
        setUserProfile(data);
        toast.success("프로필이 성공적으로 업데이트되었습니다!");
      }
    } catch {
      toast.error("프로필 업데이트 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--stone-100)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              프로필 설정
            </h2>
            <p className="text-gray-600">사용자 정보를 수정하고 관리하세요.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>개인 정보</span>
              </CardTitle>
              <CardDescription>기본 프로필 정보를 설정하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-sm text-gray-500">
                    이메일은 변경할 수 없습니다.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">사용자명</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="사용자명을 입력하세요"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    다른 사용자에게 표시될 이름입니다.
                  </p>
                </div>

                <div className="flex space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.back()}
                  >
                    취소
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "저장 중..." : "저장"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
