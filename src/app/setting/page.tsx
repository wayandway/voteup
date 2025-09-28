"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
import Link from "next/link";
import AvatarMenu from "@/components/layouts/avatar-menu";
import { User, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SettingPage() {
  const { userProfile, setUserProfile, loading: authLoading } = useAuthStore();
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [removingImage, setRemovingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!userProfile) {
      router.push("/auth/signin");
      return;
    }
    setUsername(userProfile.username || "");
  }, [userProfile, authLoading, router]);

  const handleRemoveImage = async () => {
    if (!userProfile?.profile_image) return;
    setRemovingImage(true);
    try {
      const imageUrl = userProfile.profile_image;
      const pathMatch = imageUrl.match(/profile-images\/(.*)$/);
      if (pathMatch) {
        const imagePath = pathMatch[1];
        await supabase.storage.from("profile-images").remove([imagePath]);
      }
      const { error } = await supabase
        .from("users")
        .update({ profile_image: null })
        .eq("id", userProfile.id);
      if (error) {
        toast.error("이미지 제거 실패: " + error.message);
      } else {
        setUserProfile({ ...userProfile, profile_image: undefined });
        toast.success("프로필 이미지가 제거되었습니다.");
      }
    } catch (err) {
      toast.error("이미지 제거 중 오류가 발생했습니다.");
    } finally {
      setRemovingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userProfile) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (username.trim().length < 2) {
      toast.error("사용자명은 최소 2자 이상이어야 합니다.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = userProfile.profile_image || "";
      if (profileImage) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(`profile_${userProfile.id}_${Date.now()}`, profileImage, {
            upsert: true,
          });
        if (!uploadError && uploadData) {
          imageUrl = supabase.storage
            .from("profile-images")
            .getPublicUrl(uploadData.path).data.publicUrl;
        }
      }

      const { data, error } = await supabase
        .from("users")
        .upsert({
          id: userProfile.id,
          email: userProfile.email,
          username: username.trim(),
          profile_image: imageUrl,
        })
        .select()
        .single();

      if (error) {
        toast.error("프로필 업데이트 실패: " + error.message);
      } else {
        setUserProfile({
          ...data,
          username: data.username ?? undefined,
          profile_image: data.profile_image ?? undefined,
          created_at: data.created_at ?? "",
        });
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

  if (!userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--stone-100)] pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
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
                  <Label htmlFor="profileImage">프로필 이미지</Label>
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setProfileImage(e.target.files?.[0] || null)
                    }
                  />
                  {userProfile?.profile_image && (
                    <div className="flex flex-col items-start gap-2 mt-2">
                      <img
                        src={userProfile.profile_image}
                        alt="프로필 이미지"
                        className="w-20 h-20 rounded-full"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                        disabled={removingImage}
                      >
                        {removingImage ? "제거 중..." : "이미지 제거"}
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userProfile.email || ""}
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
