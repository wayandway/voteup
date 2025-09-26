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
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { formatTime } from "@/lib/vote-utils";
import { VoteTypeIcon } from "@/lib/vote-icons";
import type { Vote as VoteType } from "@/types/vote";

interface VoteListProps {
  votes?: VoteType[];
  loading?: boolean;
  filter?: string;
  onToggleVoteStatus?: (voteId: string, currentStatus: boolean) => void;
  onCopyVoteLink?: (voteId: string) => void;
  onDeleteVote?: (voteId: string) => void;
}

export default function VoteList({
  votes = [],
  loading = false,
  filter = "all",
  onToggleVoteStatus,
  onCopyVoteLink,
  onDeleteVote,
}: VoteListProps) {
  const getFilteredVotes = useCallback(() => {
    if (!votes || votes.length === 0) return [];

    switch (filter) {
      case "active":
        return votes.filter((vote: any) => vote.is_open);
      case "closed":
        return votes.filter((vote: any) => !vote.is_open);
      default:
        return votes;
    }
  }, [votes, filter]);

  const filteredVotes = getFilteredVotes();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">투표 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (filteredVotes.length === 0) {
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
      {filteredVotes.map((vote) => {
        const totalVotes = vote.participant_count || 0;

        return (
          <Card
            key={vote.id}
            className="border bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        vote.is_open ? "bg-green-400" : "bg-gray-400"
                      }`}
                    ></div>
                    <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                      <VoteTypeIcon
                        voteType={vote.vote_type}
                        className="w-3 h-3 text-gray-800"
                      />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {vote.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(vote.created_at)}</span>
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
                      vote.is_open
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {vote.is_open ? "진행 중" : "종료됨"}
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
                    onClick={() => onCopyVoteLink?.(vote.id)}
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
                    <Link href={`/vote/${vote.id}`}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      투표 현황
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                    asChild
                  >
                    <Link href={`/vote/${vote.id}/analysis`}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      결과 분석
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          "정말로 이 투표를 삭제하시겠습니까?\n삭제된 투표는 복구할 수 없습니다."
                        )
                      ) {
                        onDeleteVote?.(vote.id);
                      }
                    }}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    삭제
                  </Button>
                </div>
                <Button
                  variant={vote.is_open ? "destructive" : "default"}
                  size="sm"
                  onClick={() => onToggleVoteStatus?.(vote.id, vote.is_open)}
                  className={
                    vote.is_open ? "" : "bg-green-600 hover:bg-green-700"
                  }
                >
                  {vote.is_open ? "투표 종료" : "투표 시작"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
