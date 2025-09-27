"use client";

import Link from "next/link";
import { useAuthStore } from "@/store";
import AvatarMenu from "./avatar-menu";

interface GlobalHeaderProps {
  fixed?: boolean;
}

export default function GlobalHeader({ fixed = false }: GlobalHeaderProps) {
  const { user } = useAuthStore();

  return (
    <header
      className={`border-b border-white/20 bg-white/50 backdrop-blur-md ${
        fixed ? "fixed top-0 left-0 right-0 z-50" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 좌측 로고 및 브랜드명 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span
                className="text-xl text-gray-900"
                style={{ fontFamily: "Gyanko" }}
              >
                VoteUp
              </span>
            </Link>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              대시보드
            </Link>
            <Link
              href="/vote/create"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              투표 만들기
            </Link>
          </nav>

          {/* 우측 메뉴 */}
          <div className="flex items-center space-x-4">
            {user ? (
              <AvatarMenu />
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
