import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

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
