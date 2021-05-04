import { Strategy } from "./strategy";
import { GameState } from "../gameState";

export class AlwaysBet implements Strategy {
  action(game: GameState): number {
    let amountToCall = game.currentBet - game.playerBetThisRound
    if (game.playerBetThisRound <= 0) {
      return amountToCall + 1;
    }
    else {
      return amountToCall;
    }
  }
}