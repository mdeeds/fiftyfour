import { Strategy } from "./strategy";
import { GameState } from "./gameState";
import { Score } from "./score";

export class BigAce implements Strategy {
  action(game: GameState): number {
    let s: Score = new Score();
    let hasAce = false;
    for (const card of game.player.holeCards) {
      if (card.pip === 'A') {
        hasAce = true;
        break;
      }
    }
    let player = game.player;
    let amountToCall = game.currentBet - player.betThisRound
    if (player.betThisRound <= 0 && hasAce) {
      return amountToCall + 10;
    }
    else {
      return 0;
    }
  }
}
