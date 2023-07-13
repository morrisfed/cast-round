export type MotionStatus =
  | "draft"
  | "proxy"
  | "open"
  | "closed"
  | "cancelled"
  | "abandoned";

export interface Motion {
  id: number;
  status: MotionStatus;
  title: string;
  description: string;
}

export type BuildableMotion = Omit<Motion, "id" | "status">;

export type MotionUpdates = BuildableMotion;
