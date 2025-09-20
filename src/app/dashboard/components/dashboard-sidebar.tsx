import { Archive, Play, CheckCircle, Vote, Calendar } from "lucide-react";
import Link from "next/link";
import { formatTime } from "@/lib/vote-utils";

interface Poll {
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

interface DashboardSidebarNewProps {
  polls: Poll[];
  filter: "all" | "active" | "completed";
  onFilterChange: (filter: "all" | "active" | "completed") => void;
  selectedPollId?: string;
}

export default function DashboardSidebarNew({
  polls,
  filter,
  onFilterChange,
  selectedPollId,
}: DashboardSidebarNewProps) {
  const getFilteredPolls = () => {
    switch (filter) {
      case "active":
        return polls.filter((poll) => poll.is_open);
      case "completed":
        return polls.filter((poll) => !poll.is_open);
      default:
        return polls;
    }
  };

  const filteredPolls = getFilteredPolls();

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
              전체 투표 ({polls.length})
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
              진행 중 ({polls.filter((p) => p.is_open).length})
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
              완료됨 ({polls.filter((p) => !p.is_open).length})
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
            {filteredPolls.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-4">
                투표가 없습니다
              </div>
            ) : (
              filteredPolls.map((poll) => {
                const totalVotes =
                  poll.options?.reduce(
                    (sum: number, option: Option) => sum + (option.count || 0),
                    0
                  ) || 0;

                return (
                  <Link
                    key={poll.id}
                    href={`/vote/${poll.id}`}
                    className={`block p-3 rounded-lg border transition-all hover:shadow-md ${
                      selectedPollId === poll.id
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {poll.title}
                        </h4>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            poll.is_open
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {poll.is_open ? "진행중" : "완료"}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatTime(poll.created_at)}</span>
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
