"use client";

import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store";
import { useEffect, useCallback } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setUserProfile, setLoading } = useAuthStore();

  const fetchUserProfile = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, email, username, profile_image, created_at")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("사용자 프로필 조회 오류:", error);
          setUserProfile(null);
        } else {
          setUserProfile({
            id: data.id,
            email: data.email,
            username: data.username ?? undefined,
            profile_image: data.profile_image ?? undefined,
            created_at: data.created_at ?? "",
          });
        }
      } catch (error) {
        console.error("사용자 프로필 조회 중 오류:", error);
        setUserProfile(null);
      }
    },
    [supabase, setUserProfile]
  );

  useEffect(() => {
    const getSession = async () => {
      try {
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
      } catch (error) {
        console.error("세션 조회 오류:", error);
        setLoading(false);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }

        setLoading(false);
      } catch (error) {
        console.error("인증 상태 변화 처리 오류:", error);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setUserProfile, setLoading, supabase, fetchUserProfile]);

  return <>{children}</>;
}
