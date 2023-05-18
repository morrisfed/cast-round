import { useMatches } from "react-router-dom";

type Flatten<T> = T extends any[] ? T[number] : T;

export interface CrumbData {
  label: string;
}

export interface CrumbMatch extends Flatten<ReturnType<typeof useMatches>> {
  handle: undefined | { crumb: (data: any) => CrumbData };
}

export type CrumbDataFn = (data: CrumbMatch) => CrumbData;
