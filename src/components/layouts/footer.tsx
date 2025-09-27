import { Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-[var(--stone-100)]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 섹션 */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span
                className="text-xl text-gray-900"
                style={{ fontFamily: "Gyanko" }}
              >
                VoteUP
              </span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              누구나 쉽게 만드는 실시간 투표 서비스. 스트리밍 이벤트, 세미나,
              온라인 모임에서 참가자들과 소통하세요.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/wayandway/voteup"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* 서비스 링크 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">서비스</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/vote/create"
                  className="hover:text-gray-900 transition-colors"
                >
                  투표 만들기
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-gray-900 transition-colors"
                >
                  대시보드
                </Link>
              </li>
              <li>
                <Link
                  href="/setting"
                  className="hover:text-gray-900 transition-colors"
                >
                  계정 설정
                </Link>
              </li>
            </ul>
          </div>

          {/* 지원 링크 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">지원</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>도움말</li>
              <li>문의하기</li>
              <li>개인정보처리방침</li>
              <li>서비스 이용약관</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {currentYear} VoteUP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
