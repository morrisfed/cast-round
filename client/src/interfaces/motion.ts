import { Role } from "./user";

export type MotionStatus =
  | "draft"
  | "proxy"
  | "open"
  | "closed"
  | "cancelled"
  | "discarded";

interface ModelRoleVotesDefinition {
  role: Role;
  votes: number;
}

interface ModelResponseDefinition {
  sequence: number;
  label: string;
}

interface ModelVoteDefinitionSchema1 {
  definitionSchemaVersion: 1;
  roleVotes: ModelRoleVotesDefinition[];
  responses: ModelResponseDefinition[];
}

type ModelVoteDefinition = ModelVoteDefinitionSchema1;

export interface Motion {
  id: number;
  status: MotionStatus;
  title: string;
  description: string;
  voteDefinition: ModelVoteDefinition;
}

export type BuildableMotion = Omit<Motion, "id" | "status">;

export type MotionUpdates = BuildableMotion;
