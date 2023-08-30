import { MotionVote } from "./motion-vote";
import { Role } from "./user";

export type MotionStatus =
  | "draft"
  | "advanced"
  | "hold"
  | "open"
  | "closed"
  | "cancelled"
  | "discarded";

export interface ModelRoleVotesDefinition {
  role: Role;
  votes: number;
}

export interface ModelResponseDefinition {
  sequence: number;
  code: string;
  label: string;
}

interface ModelVoteDefinitionSchema1 {
  definitionSchemaVersion: 1;
  roleVotes: ModelRoleVotesDefinition[];
  responses: ModelResponseDefinition[];
}

export type ModelVoteDefinition = ModelVoteDefinitionSchema1;

export interface Motion {
  id: number;
  status: MotionStatus;
  title: string;
  description: string;
  voteDefinition: ModelVoteDefinition;
}

export interface MotionWithOptionalVotes extends Motion {
  votes?: MotionVote[];
}

export type BuildableMotion = Omit<Motion, "id" | "status">;

export type MotionUpdates = BuildableMotion;
