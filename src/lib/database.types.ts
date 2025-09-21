export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          created_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          host_id: string;
          title: string;
          description?: string;
          vote_type: "single" | "multiple" | "ranking" | "binary" | "scale";
          is_open: boolean;
          created_at: string;
          expires_at?: string;
          max_selections?: number; // 복수 선택시 최대 선택 개수
          scale_min?: number; // 스케일 투표 최소값
          scale_max?: number; // 스케일 투표 최대값
          scale_step?: number; // 스케일 투표 단계
        };
        Insert: {
          id?: string;
          host_id: string;
          title: string;
          description?: string;
          vote_type?: "single" | "multiple" | "ranking" | "binary" | "scale";
          is_open?: boolean;
          created_at?: string;
          expires_at?: string;
          max_selections?: number;
          scale_min?: number;
          scale_max?: number;
          scale_step?: number;
        };
        Update: {
          id?: string;
          host_id?: string;
          title?: string;
          description?: string;
          vote_type?: "single" | "multiple" | "ranking" | "binary" | "scale";
          is_open?: boolean;
          created_at?: string;
          expires_at?: string;
          max_selections?: number;
          scale_min?: number;
          scale_max?: number;
          scale_step?: number;
        };
      };
      options: {
        Row: {
          id: string;
          vote_id: string;
          text: string;
          image_url?: string;
          image_alt?: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          vote_id: string;
          text: string;
          image_url?: string;
          image_alt?: string;
          display_order: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          vote_id?: string;
          text?: string;
          image_url?: string;
          image_alt?: string;
          display_order?: number;
          created_at?: string;
        };
      };
      responses: {
        Row: {
          id: string;
          vote_id: string;
          option_id?: string;
          participant_token: string;
          scale_value?: number;
          ranking?: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          vote_id: string;
          option_id?: string;
          participant_token: string;
          scale_value?: number;
          ranking?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          vote_id?: string;
          option_id?: string;
          participant_token?: string;
          scale_value?: number;
          ranking?: number;
          created_at?: string;
        };
      };
    };
  };
};
