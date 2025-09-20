"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Footer, GlobalHeader } from "@/components/layouts";
import { useAuthStore } from "@/store";
import { Vote, Users, BarChart3, Zap } from "lucide-react";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function HomePage() {
  const { user, userProfile } = useAuthStore();

  const scrollToFeatures = () => {
    const featuresElement = document.getElementById("features");
    if (featuresElement) {
      featuresElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <GlobalHeader fixed />
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20">
        <div className="relative z-10 text-center mb-20 max-w-6xl mx-auto">
          {/* 제목 배경 그라데이션 영역 */}
          <div className="relative mb-6">
            {/* 그라데이션 - 왼쪽 아래 */}
            <div className="absolute top-2/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[250px] md:h-[400px] bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full blur-[60px] md:blur-[80px] opacity-70 -z-10"></div>
            {/* 그라데이션 - 오른쪽 위 */}
            <div className="absolute top-1/3 right-1/3 transform translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[250px] md:h-[400px] bg-gradient-to-tl from-sky-200 to-blue-200 rounded-full blur-[60px] md:blur-[80px] opacity-70 -z-10"></div>
            <div className="relative py-4 md:py-8 px-2 sm:px-4 text-gray-900 flex flex-col items-center">
              {/* 작은 둥근 바 */}
              <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 mb-4 md:mb-6 bg-stone-100 border border-stone-200 rounded-full">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-stone-500 rounded-full mr-2"></div>
                <span className="text-xs md:text-sm font-medium text-stone-600">
                  실시간 투표 플랫폼
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-center w-full">
                누구나 쉽게, 빠르게 만드는
                <br />
                <span className=" ">온라인 투표 플랫폼</span>
              </h1>
            </div>
          </div>

          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-xl md:max-w-3xl lg:max-w-4xl mx-auto mb-6 md:mb-8 leading-relaxed px-4 text-center">
            <span className="block md:inline">
              스트리밍 이벤트, 세미나, 온라인 모임에서 참가자들과 실시간으로
              소통하세요.
            </span>
            <br className="hidden md:block" />
            <span className="block md:inline mt-2 md:mt-0">
              간편한 익명 투표와 실시간 결과 확인으로 더 나은 소통을
              경험해보세요.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12 px-4">
            <Button
              size="lg"
              className="bg-white text-gray-900 px-8 py-4 text-lg rounded-full hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={scrollToFeatures}
            >
              서비스 소개
            </Button>
            <Button
              size="lg"
              className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link href="/vote/create">
                시작하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="text-center border-0 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-[var(--stone-600)] rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                실시간 업데이트
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 leading-relaxed">
                투표 결과가 실시간으로 업데이트되어 참가자들이 즉시 현황을
                확인할 수 있습니다. 라이브 스트림처럼 생생한 투표 경험을
                제공합니다.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-[var(--stone-600)] rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                익명 참여
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 leading-relaxed">
                참가자는 로그인 없이 익명으로 투표할 수 있어 더 자유롭고 솔직한
                의견을 얻을 수 있습니다. 진정한 목소리를 들어보세요.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-[var(--stone-600)] rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                간편한 관리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 leading-relaxed">
                투표 생성부터 결과 분석까지 직관적인 인터페이스로 쉽게 관리할 수
                있습니다. 몇 분 안에 투표를 시작해보세요.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
