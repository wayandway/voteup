import {
  CircleDot,
  CheckSquare,
  BarChart3,
  GitBranch,
  Ruler,
} from "lucide-react";
import { VoteType } from "@/types/vote";

const iconComponents = {
  single: CircleDot,
  multiple: CheckSquare,
  ranking: BarChart3,
  binary: GitBranch,
  scale: Ruler,
};

interface VoteTypeIconProps {
  voteType: VoteType;
  className?: string;
  size?: number;
}

export function VoteTypeIcon({
  voteType,
  className = "",
  size,
}: VoteTypeIconProps) {
  const IconComponent = iconComponents[voteType];

  if (!IconComponent) {
    return null;
  }

  const sizeProps = size ? { width: size, height: size } : {};

  return <IconComponent className={className} {...sizeProps} />;
}

export function getVoteTypeIcon(voteType: VoteType) {
  return iconComponents[voteType];
}
