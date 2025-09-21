"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              {/* 에러 아이콘 */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>

              {/* 메인 메시지 */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                문제가 발생했습니다
              </h1>

              {/* 부제목 */}
              <p className="text-gray-600 mb-8">
                예상치 못한 오류가 발생했습니다.
                <br />
                잠시 후 다시 시도해주세요.
              </p>

              {/* 에러 상세 정보 (개발 환경에서만) */}
              {process.env.NODE_ENV === "development" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <p className="text-sm font-medium text-red-800 mb-2">
                    에러 정보:
                  </p>
                  <p className="text-xs text-red-600 font-mono break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-red-500 mt-2">
                      ID: {error.digest}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 액션 버튼들 */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={reset}
                  className="flex-1 sm:flex-none flex items-center justify-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  다시 시도
                </Button>

                <Button
                  variant="outline"
                  asChild
                  className="flex-1 sm:flex-none"
                >
                  <Link href="/" className="flex items-center justify-center">
                    <Home className="h-4 w-4 mr-2" />
                    홈으로 이동
                  </Link>
                </Button>
              </div>

              {/* 추가 정보 */}
              <div className="mt-8 pt-8 border-t border-stone-200">
                <p className="text-sm text-gray-500">
                  문제가 계속 발생한다면 페이지를 새로고침하거나
                  <br />
                  문의를 남겨주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
