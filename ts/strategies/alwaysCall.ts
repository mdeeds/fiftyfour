import { Strategy } from "./strategy";
import { HoldEm } from "../holdEm";
import { GameState } from "../gameState";

export class AlwaysCall implements Strategy {
  action(game: GameState): number {
    let currentBet = game.currentBet;
    let betSoFar = game.playerBetThisRound;
    return currentBet - betSoFar;
  }
}
