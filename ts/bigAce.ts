import { Strategy } from "./strategy";
import { GameState } from "./gameState";
import { Score } from "./score";

export class BigAce implements Strategy {
  action(game: GameState): number {
    let s: Score = new Score();
    let handString: string = s.handToString(game.player.holeCards);
    let player = game.player;
    let amountToCall = game.currentBet - player.betThisRound
    if (player.betThisRound <= 0 && handString.indexOf("A") >= 0) {
      return amountToCall + 10;
    }
    else {
      return 0;
    }
  }
}
