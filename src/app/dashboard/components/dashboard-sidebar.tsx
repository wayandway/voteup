import { Archive, Play, CheckCircle, Vote, Calendar } from "lucide-react";
import Link from "next/link";
import type { Vote as VoteType } from "@/types";

interface DashboardSidebarNewProps {
  votes: VoteType[];
  filter: "all" | "active" | "completed" | "overview";
  onFilterChange: (filter: "all" | "active" | "completed" | "overview") => void;
}

export default function DashboardSidebarNew({
  votes,
  filter,
  onFilterChange,
}: DashboardSidebarNewProps) {
  return (
    <div className="w-50 bg-[var(--stone-100)] min-h-screen p-6">
      <div className="sticky top-6">
        <h2 className="text-xl text-gray-800 mb-6 flex items-center">
          <Link href="/" className="flex items-center">
            <span style={{ fontFamily: "Gyanko" }}>VoteUP</span>
          </Link>
        </h2>

        {/* 개요(홈) 메뉴 */}
        <div className="mb-4">
          <button
            onClick={() => onFilterChange("overview" as any)}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
              filter === "overview"
                ? "bg-black text-white"
                : "text-gray-800 hover:bg-gray-100 hover:text-black cursor-pointer"
            }`}
          >
            <Calendar className="h-4 w-4 mr-2" /> 개요
          </button>
        </div>

        {/* 투표 필터 메뉴 */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-700 mb-3">투표 보기</h3>
          <div className="space-y-2">
            <button
              onClick={() => onFilterChange("all")}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                filter === "all"
                  ? "bg-black text-white"
                  : "text-gray-800 hover:text-black cursor-pointer"
              }`}
            >
              <Archive className="h-4 w-4 mr-2" /> 전체 투표 ({votes.length})
            </button>
            <button
              onClick={() => onFilterChange("active")}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                filter === "active"
                  ? "bg-black text-white"
                  : "text-gray-800 hover:text-black cursor-pointer"
              }`}
            >
              <Play className="h-4 w-4 mr-2" /> 진행 중 (
              {votes.filter((v) => v.is_open).length})
            </button>
            <button
              onClick={() => onFilterChange("completed")}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                filter === "completed"
                  ? "bg-black text-white"
                  : "text-gray-800 hover:text-black cursor-pointer"
              }`}
            >
              <CheckCircle className="h-4 w-4 mr-2" /> 완료됨 (
              {votes.filter((v) => !v.is_open).length})
            </button>
          </div>
        </div>
      </div>
      {/* 사이드바 하단 메뉴 */}
      <div className="absolute bottom-0 left-0 w-50 p-6 pb-8 flex flex-col gap-3 bg-[var(--stone-100)]">
        <Link href="/vote/create" className="w-full">
          <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors text-gray-800 hover:text-black cursor-pointer">
            <Vote className="h-4 w-4 mr-2" /> 투표 생성
          </button>
        </Link>
        <Link href="/setting" className="w-full">
          <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors text-gray-800 hover:text-black cursor-pointer">
            <Archive className="h-4 w-4 mr-2" /> 설정
          </button>
        </Link>
      </div>
    </div>
  );
}
