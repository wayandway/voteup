"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuthStore, usePollStore } from "@/store";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import {
  Vote,
  Plus,
  Users,
  BarChart3,
  ExternalLink,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatTime, generatePollLink } from "@/lib/vote-utils";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { polls, setPolls, loading, setLoading } = usePollStore();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // 인증 상태 로딩 중이면 대기
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push("/auth/login");
      return;
    }

    fetchPolls();
  }, [user, authLoading, router]);

  const fetchPolls = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("polls")
        .select(
          `
          *,
          options (*)
        `
        )
        .eq("host_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("투표 목록을 불러오는 중 오류가 발생했습니다.");
      } else {
        setPolls(data || []);
      }
    } catch (error) {
      toast.error("투표 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const togglePollStatus = async (pollId: string, currentStatus: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from("polls")
        .update({ is_open: !currentStatus })
        .eq("id", pollId);

      if (error) {
        toast.error("투표 상태 변경 실패");
      } else {
        toast.success(
          currentStatus ? "투표를 종료했습니다." : "투표를 시작했습니다."
        );
        fetchPolls();
      }
    } catch (error) {
      toast.error("투표 상태 변경 중 오류가 발생했습니다.");
    }
  };

  const copyPollLink = async (pollId: string) => {
    const link = generatePollLink(pollId);
    try {
      await navigator.clipboard.writeText(link);
      toast.success("투표 링크가 복사되었습니다!");
    } catch (error) {
      toast.error("링크 복사에 실패했습니다.");
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

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <Button asChild>
              <Link href="/vote/create">
                <Plus className="h-4 w-4 mr-2" />새 투표
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h2>
          <p className="text-gray-600">
            투표를 관리하고 실시간 결과를 확인하세요.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">투표 목록을 불러오는 중...</p>
          </div>
        ) : polls.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Vote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                아직 투표가 없습니다
              </h3>
              <p className="text-gray-600 mb-6">
                첫 번째 투표를 만들어 참가자들과 소통해보세요.
              </p>
              <Button asChild>
                <Link href="/vote/create">
                  <Plus className="h-4 w-4 mr-2" />
                  투표 만들기
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {polls.map((poll) => {
              const totalVotes =
                poll.options?.reduce((sum, option) => sum + option.count, 0) ||
                0;

              return (
                <Card
                  key={poll.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{poll.title}</CardTitle>
                        {poll.description && (
                          <CardDescription className="mt-1">
                            {poll.description}
                          </CardDescription>
                        )}
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {totalVotes} 참가자
                          </span>
                          <span className="flex items-center">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            {poll.options?.length || 0} 선택지
                          </span>
                          <span>{formatTime(poll.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            poll.is_open
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {poll.is_open ? "진행 중" : "종료됨"}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyPollLink(poll.id)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          링크 복사
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/vote/${poll.id}`}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            결과 보기
                          </Link>
                        </Button>
                      </div>
                      <Button
                        variant={poll.is_open ? "destructive" : "default"}
                        size="sm"
                        onClick={() => togglePollStatus(poll.id, poll.is_open)}
                      >
                        {poll.is_open ? "투표 종료" : "투표 시작"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
