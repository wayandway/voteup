"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useAuthStore } from "@/store";
import { Vote, Users, BarChart3, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Vote className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">VoteUP</h1>
          </div>

          <nav className="flex items-center space-x-4">
            {authLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">로딩 중...</span>
              </div>
            ) : user ? (
              <>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">대시보드</Link>
                </Button>
                <Button asChild>
                  <Link href="/vote/create">투표 만들기</Link>
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

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            실시간 투표의 새로운 경험
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            스트리밍 이벤트, 세미나, 온라인 모임에서 참가자들과 실시간으로
            소통하세요. 간편한 익명 투표와 실시간 결과 확인이 가능합니다.
          </p>

          {user ? (
            <div className="flex justify-center space-x-4">
              <Button size="lg" asChild>
                <Link href="/vote/create">투표 만들기</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">내 투표 관리</Link>
              </Button>
            </div>
          ) : (
            <div className="flex justify-center space-x-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">무료로 시작하기</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">로그인</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>실시간 업데이트</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                투표 결과가 실시간으로 업데이트되어 참가자들이 실시간으로 현황을
                확인할 수 있습니다.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>익명 참여</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                참가자는 로그인 없이 익명으로 투표할 수 있어 더 자유롭고 솔직한
                의견을 얻을 수 있습니다.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>간편한 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                투표 생성부터 결과 분석까지 직관적인 인터페이스로 쉽게 관리할 수
                있습니다.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            지금 바로 투표를 시작해보세요!
          </h3>
          <p className="text-gray-600 mb-6">
            몇 분 안에 투표를 만들고 참가자들과 실시간으로 소통할 수 있습니다.
          </p>

          {!user && (
            <Button size="lg" asChild>
              <Link href="/auth/signup">무료 계정 만들기</Link>
            </Button>
          )}
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2025 VoteUP. 실시간 투표의 새로운 경험.</p>
        </div>
      </footer>
    </div>
  );
}
