/**
 * 참가자의 고유 토큰 생성 (LocalStorage + IP 기반)
 */
export const generateParticipantToken = (): string => {
  if (typeof window === "undefined") {
    return `participant_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  const stored = localStorage.getItem("voteup_participant_token");
  if (stored) {
    return stored;
  }

  const token = `participant_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  localStorage.setItem("voteup_participant_token", token);
  return token;
};

/**
 * 투표 가능 여부 확인 (LocalStorage 기반)
 */
export const canVote = (voteId: string): boolean => {
  if (typeof window === "undefined") {
    return true;
  }

  const voted = localStorage.getItem(`voted_${voteId}`);
  return !voted;
};

/**
 * 투표 완료 표시
 */
export const markAsVoted = (voteId: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(`voted_${voteId}`, "true");
};

/**
 * 투표 링크 생성
 */
export const generateVoteLink = (voteId: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${baseUrl}/vote/${voteId}`;
};

/**
 * 이전 함수들과의 호환성을 위한 별칭
 */
export const generatePollLink = generateVoteLink;

/**
 * 시간 포맷팅
 */
export const formatTime = (date: string): string => {
  return new Date(date).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * 투표 진행률 계산
 */
export const calculateProgress = (options: { count: number }[]): number => {
  const total = options.reduce((sum, option) => sum + option.count, 0);
  return total;
};

/**
 * 클라이언트 IP 가져오기 (서버 사이드에서 사용)
 */
export const getClientIP = (req: Request): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIP = req.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
};
