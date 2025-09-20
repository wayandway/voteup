import { Vote, Github, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 섹션 */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Vote className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">VoteUP</span>
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
                  href="/profile"
                  className="hover:text-gray-900 transition-colors"
                >
                  프로필 설정
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="hover:text-gray-900 transition-colors"
                >
                  기능 소개
                </Link>
              </li>
            </ul>
          </div>

          {/* 지원 링크 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">지원</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/help"
                  className="hover:text-gray-900 transition-colors"
                >
                  도움말
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-gray-900 transition-colors"
                >
                  문의하기
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-gray-900 transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-gray-900 transition-colors"
                >
                  서비스 이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {currentYear} VoteUP. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2 sm:mt-0">
            Made with for better communication
          </p>
        </div>
      </div>
    </footer>
  );
}
