export interface MotionVote {
  responseCode: string;
  votes: number;
}

export interface MotionVoteSubtotal {
  responseCode: string;
  subtotal: number;
  proxy: boolean;
}
