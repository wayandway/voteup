import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import type { Vote, VoteOption, VoteType } from "@/types/vote";

interface UserProfile {
  id: string;
  email: string;
  username?: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userProfile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setLoading: (loading) => set({ loading }),
}));

interface VoteState {
  votes: Vote[];
  currentVote: Vote | null;
  loading: boolean;
  setVotes: (votes: Vote[]) => void;
  setCurrentVote: (vote: Vote | null) => void;
  setLoading: (loading: boolean) => void;
  updateOptionCount: (optionId: string, count: number) => void;
}

export const useVoteStore = create<VoteState>((set, get) => ({
  votes: [],
  currentVote: null,
  loading: false,
  setVotes: (votes) => set({ votes }),
  setCurrentVote: (vote) => set({ currentVote: vote }),
  setLoading: (loading) => set({ loading }),
  updateOptionCount: (optionId, count) => {
    const { currentVote } = get();
    if (currentVote) {
      const updatedOptions = currentVote.options.map((option) =>
        option.id === optionId ? { ...option, count } : option
      );
      set({
        currentVote: {
          ...currentVote,
          options: updatedOptions,
        },
      });
    }
  },
}));

// 이전 PollStore도 호환성을 위해 유지 (나중에 제거 예정)
interface Poll {
  id: string;
  title: string;
  description?: string;
  is_open: boolean;
  created_at: string;
  expires_at?: string;
  options: Option[];
}

interface Option {
  id: string;
  poll_id: string;
  label: string;
  count: number;
}

interface PollState {
  polls: Poll[];
  currentPoll: Poll | null;
  loading: boolean;
  setPolls: (polls: Poll[]) => void;
  setCurrentPoll: (poll: Poll | null) => void;
  setLoading: (loading: boolean) => void;
  updateOptionCount: (optionId: string, count: number) => void;
}

export const usePollStore = create<PollState>((set, get) => ({
  polls: [],
  currentPoll: null,
  loading: false,
  setPolls: (polls) => set({ polls }),
  setCurrentPoll: (poll) => set({ currentPoll: poll }),
  setLoading: (loading) => set({ loading }),
  updateOptionCount: (optionId, count) => {
    const { currentPoll } = get();
    if (currentPoll) {
      const updatedOptions = currentPoll.options.map((option) =>
        option.id === optionId ? { ...option, count } : option
      );
      set({
        currentPoll: {
          ...currentPoll,
          options: updatedOptions,
        },
      });
    }
  },
}));
