import { Strategy } from "./strategy";
import { HoldEm } from "./holdEm";

export class AlwaysBet implements Strategy {
  action(game: HoldEm): number {
    let player = game.getCurrentPlayer();
    let amountToCall = game.getCurrentBet() - player.betThisRound
    if (player.betThisRound <= 0) {
      return amountToCall + 1;
    }
    else {
      return amountToCall;
    }
  }
}
