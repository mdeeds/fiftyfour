import { GameState } from "./gameState";
import { HoldEm } from "./holdEm";

export interface Strategy {
  action(game: GameState): number;
}