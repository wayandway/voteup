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
        <h2 className="text-xl text-gray-900 mb-6 flex items-center">
          <Link href="/" className="flex items-center">
            <span style={{ fontFamily: "Gyanko" }}>VoteUP</span>
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
      </div>
    </div>
  );
}
