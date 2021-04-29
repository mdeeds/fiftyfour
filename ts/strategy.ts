import { HoldEm } from "./holdEm";

export interface Strategy {
  action(game: HoldEm): number;
}