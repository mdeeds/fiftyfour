import { Strategy } from "./strategy";
import { HoldEm } from "./holdEm";

export class AlwaysCall implements Strategy {
  action(game: HoldEm): number {
    let currentBet = game.getCurrentBet();
    let player = game.getCurrentPlayer();
    let betSoFar = player.betThisRound;
    return currentBet - betSoFar;
  }
}
