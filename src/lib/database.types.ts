export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
      polls: {
        Row: {
          id: string;
          host_id: string;
          title: string;
          description?: string;
          is_open: boolean;
          created_at: string;
          expires_at?: string;
          max_votes_per_option?: number;
        };
        Insert: {
          id?: string;
          host_id: string;
          title: string;
          description?: string;
          is_open?: boolean;
          created_at?: string;
          expires_at?: string;
          max_votes_per_option?: number;
        };
        Update: {
          id?: string;
          host_id?: string;
          title?: string;
          description?: string;
          is_open?: boolean;
          created_at?: string;
          expires_at?: string;
          max_votes_per_option?: number;
        };
      };
      options: {
        Row: {
          id: string;
          poll_id: string;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          text?: string;
          created_at?: string;
        };
      };
      responses: {
        Row: {
          id: string;
          poll_id: string;
          option_id: string;
          participant_token: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          option_id: string;
          participant_token: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          option_id?: string;
          participant_token?: string;
          created_at?: string;
        };
      };
    };
  };
};
