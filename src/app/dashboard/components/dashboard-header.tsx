import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import Link from "next/link";
import AvatarMenu from "@/components/layouts/avatar-menu";

interface DashboardHeaderProps {
  userProfile?: {
    username?: string;
  } | null;
  pollCount: number;
  filter: "all" | "active" | "completed";
}

export default function DashboardHeader({
  userProfile,
  pollCount,
  filter,
}: DashboardHeaderProps) {
  const getFilterTitle = () => {
    switch (filter) {
      case "active":
        return "진행 중인 투표";
      case "completed":
        return "완료된 투표";
      default:
        return "전체 투표";
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            안녕하세요, {userProfile?.username || "사용자"}님!
          </h1>
          <p className="text-gray-600 mt-2">
            투표를 관리하고 결과를 확인해보세요
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="bg-gray-800 hover:bg-gray-900 text-white">
            <Link href="/vote/create">
              <Plus className="h-4 w-4 mr-2" />새 투표 만들기
            </Link>
          </Button>
          <AvatarMenu />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {getFilterTitle()}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{pollCount}개의 투표</p>
        </div>
      </div>
    </div>
  );
}
