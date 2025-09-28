"use client";

import { Settings, LogOut, Vote, User } from "lucide-react";
import { useAuthStore } from "@/store";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AvatarMenu() {
  const { user, userProfile, setUser, setUserProfile } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("로그아웃 실패: " + error.message);
      } else {
        setUser(null);
        setUserProfile(null);
        toast.success("로그아웃되었습니다.");
        router.push("/");
      }
    } catch {
      toast.error("로그아웃 중 오류가 발생했습니다.");
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <button className="hover:opacity-80 transition-opacity focus:outline-none">
          <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm overflow-hidden">
            {userProfile?.profile_image ? (
              <img
                src={userProfile.profile_image}
                alt="프로필 이미지"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center cursor-pointer">
            <Vote className="h-4 w-4 mr-2" />
            대시보드
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/vote/create"
            className="flex items-center cursor-pointer"
          >
            <Vote className="h-4 w-4 mr-2" />새 투표
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/setting" className="flex items-center cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            설정
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
