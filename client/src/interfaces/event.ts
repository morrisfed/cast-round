import { Motion } from "./motion";

export interface Event {
  id: number;
  name: string;
  description: string;
  fromDate: Date;
  toDate: Date;
}

export interface EventWithMotions extends Event {
  motions: Motion[];
}
