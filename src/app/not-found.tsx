import Link from "next/link";
import { Button } from "@/components/ui";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-4xl font-bold text-stone-300 mb-4">404</div>

          {/* 메인 메시지 */}
          <h1 className="text-md font-bold text-gray-900 mb-4">
            페이지를 찾을 수 없습니다
          </h1>

          {/* 부제목 */}
          <p className="text-gray-600 mb-8">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            <br />
            URL을 다시 확인해주세요.
          </p>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="flex-1 sm:flex-none">
              <Link href="/" className="flex items-center justify-center">
                <Home className="h-4 w-4 mr-2" />
                홈으로 이동
              </Link>
            </Button>
          </div>

          {/* 추가 도움말 */}
          <div className="mt-8 pt-8 border-t border-stone-200">
            <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
              <Search className="h-4 w-4 mr-2" />
              도움이 필요하신가요?
            </div>

            <div className="space-y-2 text-sm">
              {/* TODO: 문의하기 링크 추가 필요 */}
              <Link
                href="/"
                className="block text-blue-600 hover:text-blue-800 transition-colors"
              >
                문의하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
