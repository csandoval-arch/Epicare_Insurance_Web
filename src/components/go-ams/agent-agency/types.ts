export type RoleMode = "agent" | "agency";

export interface FeaturePill {
  title: string;
  description: string;
  badge: string;
}

export interface ComparisonImage {
  id: string;
  src: string;
  alt: string;
}

export interface AgentAgencyHeaderProps {
  activeRole: RoleMode;
  onRoleChange: (role: RoleMode) => void;
  title?: React.ReactNode;
  description?: string;
}

export interface AgentAgencyImageShowcaseProps {
  images: ComparisonImage[];
  activeSlide: number;
  imageContainerRef: React.RefObject<HTMLDivElement | null>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export interface AgentAgencyFeatureCardsProps {
  isAgent: boolean;
  features: FeaturePill[];
  activeSlide: number;
  isPaused: boolean;
  onSelectSlide: (index: number) => void;
}
