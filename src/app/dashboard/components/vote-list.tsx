import { useCallback } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import {
  Plus,
  ExternalLink,
  BarChart3,
  Clock,
  Users,
  Vote,
} from "lucide-react";
import Link from "next/link";
import { formatTime } from "@/lib/vote-utils";

interface Vote {
  id: string;
  title: string;
  is_open: boolean;
  created_at: string;
  options?: Option[];
}

interface Option {
  id: string;
  poll_id: string;
  label: string;
  count: number;
}

interface VoteListProps {
  polls?: Vote[];
  loading?: boolean;
  filter?: string;
  onTogglePollStatus?: (pollId: string, currentStatus: boolean) => void;
  onCopyPollLink?: (pollId: string) => void;
}

export default function VoteList({
  polls = [],
  loading = false,
  filter = "all",
  onTogglePollStatus,
  onCopyPollLink,
}: VoteListProps) {
  const getFilteredPolls = useCallback(() => {
    if (!polls || polls.length === 0) return [];

    switch (filter) {
      case "active":
        return polls.filter((poll: any) => poll.is_open);
      case "closed":
        return polls.filter((poll: any) => !poll.is_open);
      default:
        return polls;
    }
  }, [polls, filter]);

  const filteredPolls = getFilteredPolls();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">투표 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (filteredPolls.length === 0) {
    return (
      <Card className="border bg-white shadow-lg">
        <CardContent className="py-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Vote className="h-10 w-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {filter === "all"
                ? "아직 투표가 없어요"
                : "해당 조건의 투표가 없어요"}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "첫 번째 투표를 만들어서 참가자들과 소통해보세요!"
                : "다른 필터 조건을 선택해보세요."}
            </p>
            {filter === "all" && (
              <Button
                size="lg"
                className="bg-gray-800 hover:bg-gray-900 text-white shadow-lg"
                asChild
              >
                <Link href="/vote/create">
                  <Plus className="h-5 w-5 mr-2" />
                  투표 만들기
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {filteredPolls.map((poll) => {
        const totalVotes =
          poll.options?.reduce(
            (sum: number, option: Option) => sum + (option.count || 0),
            0
          ) || 0;

        return (
          <Card
            key={poll.id}
            className="border bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        poll.is_open ? "bg-green-400" : "bg-gray-400"
                      }`}
                    ></div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {poll.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(poll.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{totalVotes}명 참여</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopyPollLink?.(poll.id)}
                    className="border-gray-200 hover:bg-gray-50"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    링크 복사
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200 hover:bg-gray-50"
                    asChild
                  >
                    <Link href={`/vote/${poll.id}`}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      결과 보기
                    </Link>
                  </Button>
                </div>
                <Button
                  variant={poll.is_open ? "destructive" : "default"}
                  size="sm"
                  onClick={() => onTogglePollStatus?.(poll.id, poll.is_open)}
                  className={
                    poll.is_open ? "" : "bg-green-600 hover:bg-green-700"
                  }
                >
                  {poll.is_open ? "투표 종료" : "투표 시작"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
