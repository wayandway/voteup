"use client";

import { createClient } from "@/lib/supabase";
import { useAuthStore } from "@/store";
import { useEffect, useCallback, useState } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setUserProfile, setLoading } = useAuthStore();
  const supabase = createClient();
  const [isMounted, setIsMounted] = useState(false);

  const fetchUserProfile = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("사용자 프로필 조회 오류:", error);
          setUserProfile(null);
        } else {
          setUserProfile(data);
        }
      } catch (error) {
        console.error("사용자 프로필 조회 중 오류:", error);
        setUserProfile(null);
      }
    },
    [supabase, setUserProfile]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // 초기 세션 확인
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    };

    getSession();

    // 인증 상태 변화 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [
    isMounted,
    setUser,
    setUserProfile,
    setLoading,
    supabase,
    fetchUserProfile,
  ]);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
}
