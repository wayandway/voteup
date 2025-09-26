import { Archive, Play, CheckCircle, Vote, Calendar } from "lucide-react";
import Link from "next/link";
import { formatTime, VoteTypeIcon } from "@/lib";
import type { Vote as VoteType } from "@/types";

interface DashboardSidebarNewProps {
  votes: VoteType[];
  filter: "all" | "active" | "completed";
  onFilterChange: (filter: "all" | "active" | "completed") => void;
  selectedVoteId?: string;
}

export default function DashboardSidebarNew({
  votes,
  filter,
  onFilterChange,
  selectedVoteId,
}: DashboardSidebarNewProps) {
  const getFilteredVotes = () => {
    switch (filter) {
      case "active":
        return votes.filter((vote) => vote.is_open);
      case "completed":
        return votes.filter((vote) => !vote.is_open);
      default:
        return votes;
    }
  };

  const filteredVotes = getFilteredVotes();

  return (
    <div className="w-80 bg-white shadow-lg min-h-screen p-6">
      <div className="sticky top-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Link href="/" className="flex items-center">
            VoteUP
          </Link>
        </h2>

        {/* 필터 옵션 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            상태별 필터
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => onFilterChange("all")}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors text-gray-600 ${
                filter === "all"
                  ? "bg-gray-100 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              <Archive className="h-4 w-4 mr-2" />
              전체 투표 ({votes.length})
            </button>
            <button
              onClick={() => onFilterChange("active")}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                filter === "active"
                  ? "bg-green-100 text-green-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Play className="h-4 w-4 mr-2" />
              진행 중 ({votes.filter((v) => v.is_open).length})
            </button>
            <button
              onClick={() => onFilterChange("completed")}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                filter === "completed"
                  ? "bg-gray-100 text-gray-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              완료됨 ({votes.filter((v) => !v.is_open).length})
            </button>
          </div>
        </div>

        {/* 투표 목록 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {filter === "all"
              ? "전체"
              : filter === "active"
              ? "진행 중인"
              : "완료된"}{" "}
            투표 목록
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredVotes.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-4">
                투표가 없습니다
              </div>
            ) : (
              filteredVotes.map((vote) => {
                const totalVotes = vote.participant_count || 0;

                return (
                  <Link
                    key={vote.id}
                    href={`/vote/${vote.id}`}
                    className={`block p-3 rounded-lg border transition-all hover:shadow-md ${
                      selectedVoteId === vote.id
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2 flex-1">
                          <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                            <VoteTypeIcon
                              voteType={vote.vote_type}
                              className="w-3 h-3 text-gray-800"
                            />
                          </div>
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {vote.title}
                          </h4>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${
                            vote.is_open
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {vote.is_open ? "진행중" : "완료"}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatTime(vote.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Vote className="h-3 w-3" />
                          <span>{totalVotes}명</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
