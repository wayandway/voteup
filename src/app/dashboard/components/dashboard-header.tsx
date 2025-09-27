import AvatarMenu from "@/components/layouts/avatar-menu";

export default function DashboardHeader({}: any) {
  return (
    <div className="sticky top-0 z-10 bg-white px-8 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between gap-4">
        {/* 검색창 */}
        <div className="flex items-center w-full max-w-2xl bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
          <svg
            className="w-4 h-4 text-gray-400 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="검색"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        {/* 아바타 프로필 */}
        <div className="flex-shrink-0">
          <AvatarMenu />
        </div>
      </div>
    </div>
  );
}
