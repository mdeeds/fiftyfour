import { Strategy } from "./strategy";
import { GameState } from "./gameState";

export class AlwaysBet implements Strategy {
  action(game: GameState): number {
    let player = game.player;
    let amountToCall = game.currentBet - player.betThisRound
    if (player.betThisRound <= 0) {
      return amountToCall + 1;
    }
    else {
      return amountToCall;
    }
  }
}
