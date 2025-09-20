"use client";

import { Vote } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/store";

export default function Header() {
  const { user } = useAuthStore();

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
              <span className="text-sm text-gray-600 hidden sm:inline">
                {user.email}
              </span>
              <Button variant="outline" asChild>
                <Link href="/dashboard">대시보드</Link>
              </Button>
              <Button asChild>
                <Link href="/vote/create">새 투표</Link>
              </Button>
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
    </header>
  );
}
