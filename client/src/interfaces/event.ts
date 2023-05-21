import { Vote } from "./vote";

export interface Event {
  id: number;
  name: string;
  description: string;
  fromDate: Date;
  toDate: Date;
}

export interface EventWithVotes extends Event {
  votes: Vote[];
}
