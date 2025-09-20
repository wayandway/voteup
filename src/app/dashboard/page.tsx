"use client";

import { useEffect, useCallback, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuthStore, usePollStore } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { generatePollLink } from "@/lib/vote-utils";
import { DashboardSidebar, DashboardHeader, VoteList } from "./components";

export default function DashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuthStore();
  const { polls, setPolls, loading, setLoading } = usePollStore();
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchPolls = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("polls")
        .select(
          `
          *,
          options (*)
        `
        )
        .eq("host_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("투표 목록을 불러오는 중 오류가 발생했습니다.");
      } else {
        setPolls(data || []);
      }
    } catch {
      toast.error("투표 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    // 인증 상태 로딩 중이면 대기
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push("/auth/login");
      return;
    }

    fetchPolls();
  }, [user?.id, authLoading, fetchPolls]);

  const togglePollStatus = async (pollId: string, currentStatus: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from("polls")
        .update({ is_open: !currentStatus })
        .eq("id", pollId);

      if (error) {
        toast.error("투표 상태 변경 실패");
      } else {
        toast.success(
          currentStatus ? "투표를 종료했습니다." : "투표를 시작했습니다."
        );
        fetchPolls();
      }
    } catch {
      toast.error("투표 상태 변경 중 오류가 발생했습니다.");
    }
  };

  const copyPollLink = async (pollId: string) => {
    const link = generatePollLink(pollId);
    try {
      await navigator.clipboard.writeText(link);
      toast.success("투표 링크가 복사되었습니다!");
    } catch {
      toast.error("링크 복사에 실패했습니다.");
    }
  };

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

  if (!mounted) {
    return null; // 하이드레이션 방지
  }

  return (
    <div className="min-h-screen bg-[var(--stone-100)]">
      <div className="flex">
        <DashboardSidebar
          polls={polls}
          filter={filter}
          onFilterChange={setFilter}
        />

        <div className="flex-1 p-8">
          <DashboardHeader
            userProfile={userProfile}
            pollCount={getFilteredPolls().length}
            filter={filter}
          />

          <VoteList
            polls={polls}
            loading={loading}
            filter={filter}
            onTogglePollStatus={togglePollStatus}
            onCopyPollLink={copyPollLink}
          />
        </div>
      </div>
    </div>
  );
}
