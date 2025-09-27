import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";
import { BarChart3, Plus, Users, CheckCircle, Play } from "lucide-react";
import Link from "next/link";
import type { Vote } from "@/types";

interface OverviewCardsProps {
  votes: Vote[];
  participantCount: number;
  recentVotes: Vote[];
  popularVote?: Vote;
}

export default function OverviewCards({
  votes,
  participantCount,
  recentVotes,
  popularVote,
}: OverviewCardsProps) {
  const totalVotes = votes.length;
  const activeVotes = votes.filter((v) => v.is_open).length;
  const completedVotes = votes.filter((v) => !v.is_open).length;

  return (
    <div className="space-y-8 text-sm">
      {/* 상단 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <CardTitle>전체 투표</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotes}개</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center space-x-2">
            <Play className="h-5 w-5 text-green-600" />
            <CardTitle>진행중</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVotes}개</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-gray-600" />
            <CardTitle>완료됨</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedVotes}개</div>
          </CardContent>
        </Card>
      </div>

      {/* 최근 생성한 투표 카드 */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">최근 생성한 투표</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentVotes.length === 0 ? (
                <div className="text-gray-500">최근 투표가 없습니다.</div>
              ) : (
                recentVotes.map((vote) => (
                  <Link
                    key={vote.id}
                    href={`/vote/${vote.id}`}
                    className="block p-3 rounded-lg border hover:shadow transition-all text-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">{vote.title}</div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          vote.is_open
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {vote.is_open ? "진행중" : "완료"}
                      </span>
                    </div>
                    <div className="text-gray-500 mt-1">
                      참여자: {vote.participant_count || 0}명
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 참여 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">총 참여자 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{participantCount}명</div>
            {/* 실제 그래프는 Chart.js 등으로 대체 가능, 여기선 예시로 막대만 */}
            <div className="h-16 bg-gray-100 rounded flex items-end">
              <div className="w-2/3 h-2/3 bg-blue-400 rounded mx-auto"></div>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              최근 7일간 참여 추이 (예시)
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">가장 인기 투표</CardTitle>
          </CardHeader>
          <CardContent>
            {popularVote ? (
              <Link
                href={`/vote/${popularVote.id}`}
                className="block p-3 rounded-lg border hover:shadow transition-all text-sm"
              >
                <div className="font-semibold">{popularVote.title}</div>
                <div className="text-gray-500 mt-1">
                  참여자: {popularVote.participant_count || 0}명
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    popularVote.is_open
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {popularVote.is_open ? "진행중" : "완료"}
                </span>
              </Link>
            ) : (
              <div className="text-gray-500">인기 투표가 없습니다.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
