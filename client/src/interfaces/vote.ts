export type VoteStatus =
  | "draft"
  | "proxy"
  | "open"
  | "closed"
  | "cancelled"
  | "abandoned";

export interface Vote {
  id: number;
  status: VoteStatus;
  title: string;
  description: string;
}

export type BuildableVote = Omit<Vote, "id" | "status">;

export type VoteUpdates = BuildableVote;
