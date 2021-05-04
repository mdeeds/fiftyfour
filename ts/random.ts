import { Strategy } from "./strategies/strategy";
import { GameState } from "./gameState";

export class Random implements Strategy {
  action(game: GameState): number {
    return Math.random() * 20;
  }
}