export type VoteType = "single" | "multiple" | "ranking" | "binary" | "scale";

export interface VoteOption {
  id: string;
  vote_id: string;
  text: string;
  image_url?: string;
  image_alt?: string;
  display_order: number;
  created_at: string;
}

export interface Vote {
  id: string;
  host_id: string;
  title: string;
  description?: string;
  vote_type: VoteType;
  is_open: boolean;
  created_at: string;
  expires_at?: string;
  max_selections?: number; // 복수 선택시 최대 선택 개수
  scale_min?: number; // 스케일 투표 최소값 (default: 1)
  scale_max?: number; // 스케일 투표 최대값 (default: 5)
  scale_step?: number; // 스케일 투표 단계 (default: 1)
  participant_count?: number; // 참여자 수 (선택적)
  host_username?: string;
  options: VoteOption[];
}

export interface VoteResponse {
  id: string;
  vote_id: string;
  option_id?: string;
  participant_token: string;
  scale_value?: number; 
  ranking?: number;
  created_at: string;
}

export interface CreateVoteOptionData {
  text: string;
  image_url?: string; // URL 또는 Base64
  image_alt?: string;
  image_file?: File; // 업로드할 파일 객체
  display_order: number;
}

export interface CreateVoteData {
  title: string;
  description?: string;
  vote_type: VoteType;
  options: CreateVoteOptionData[];
  expires_at?: string;
  max_selections?: number;
  scale_min?: number;
  scale_max?: number;
  scale_step?: number;
  host_username?: string;
}

export interface VoteResult {
  option: VoteOption;
  count: number;
  percentage: number;
  averageRanking?: number; 
  averageScale?: number;
}

export interface VoteResults {
  vote: Vote;
  results: VoteResult[];
  totalResponses: number;
  responsesByType: {
    [key: string]: number;
  };
}

export interface VoteTypeConfig {
  name: string;
  description: string;
  icon: string;
  iconComponent: string; // lucide-react 아이콘 컴포넌트 이름
  minOptions: number;
  maxOptions: number;
  allowImages: boolean;
  hasSettings: boolean;
}

export const VOTE_TYPE_CONFIGS: Record<VoteType, VoteTypeConfig> = {
  single: {
    name: "단일 선택",
    description: "하나의 선택지만 선택할 수 있습니다",
    icon: "🔘",
    iconComponent: "CircleDot",
    minOptions: 2,
    maxOptions: 10,
    allowImages: true,
    hasSettings: false,
  },
  multiple: {
    name: "복수 선택",
    description: "여러 선택지를 선택할 수 있습니다",
    icon: "☑️",
    iconComponent: "CheckSquare",
    minOptions: 2,
    maxOptions: 10,
    allowImages: true,
    hasSettings: true,
  },
  ranking: {
    name: "순위 투표",
    description: "선택지를 선호도 순으로 정렬합니다",
    icon: "📊",
    iconComponent: "BarChart3",
    minOptions: 2,
    maxOptions: 8,
    allowImages: true,
    hasSettings: false,
  },
  binary: {
    name: "이분 투표",
    description: "두 가지 선택지 중 하나를 선택합니다",
    icon: "👍",
    iconComponent: "GitBranch",
    minOptions: 2,
    maxOptions: 2,
    allowImages: true,
    hasSettings: false,
  },
  scale: {
    name: "척도 투표",
    description: "숫자 범위에서 값을 선택합니다",
    icon: "📏",
    iconComponent: "Ruler",
    minOptions: 1,
    maxOptions: 1,
    allowImages: false,
    hasSettings: true,
  },
};
