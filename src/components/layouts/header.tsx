"use client";

import { useState, useEffect } from "react";
import { Vote, Menu, X, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/store";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Header() {
  const { user, userProfile, setUser, setUserProfile } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

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
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Vote className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">VoteUP</h1>
        </Link>

        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              {/* 데스크톱 메뉴 */}
              <div className="hidden md:flex items-center space-x-4">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">대시보드</Link>
                </Button>
                <Button asChild>
                  <Link href="/vote/create">새 투표</Link>
                </Button>
              </div>

              {/* 사용자 드롭다운 메뉴 */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    {userProfile?.username || user.email}
                  </span>
                  {isMenuOpen ? (
                    <X className="h-4 w-4 text-gray-600" />
                  ) : (
                    <Menu className="h-4 w-4 text-gray-600" />
                  )}
                </button>

                {/* 드롭다운 메뉴 */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    {/* 모바일에서만 보이는 메뉴 항목들 */}
                    <div className="md:hidden">
                      <Link
                        href="/dashboard"
                        onClick={closeMenu}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Vote className="h-4 w-4 mr-3" />
                        대시보드
                      </Link>
                      <Link
                        href="/vote/create"
                        onClick={closeMenu}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Vote className="h-4 w-4 mr-3" />새 투표
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                    </div>

                    {/* 공통 메뉴 항목들 */}
                    <Link
                      href="/setting"
                      onClick={closeMenu}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      설정
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/auth/login">로그인</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">회원가입</Link>
              </Button>
            </>
          )}
        </nav>
      </div>

      {/* 오버레이 (모바일에서 메뉴 닫기용) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={closeMenu}></div>
      )}
    </header>
  );
}
