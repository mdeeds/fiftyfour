import { Strategy } from "./strategy";
import { Score } from "./score";
import { GameState } from "./gameState";
import { GamePhase } from "./holdEm";

export class Steve implements Strategy {
  s: Score;
  maxBet: number;

  constructor(maxBet: number = 10) {
    this.s = new Score();
    this.maxBet = maxBet;
  }

  action(game: GameState): number {
    let player = game.player;
    let amountToCall = game.currentBet - player.betThisRound;
    if (game.phase == 'pre-flop') {
      let probabilityToWin = this.s.percentToWin(game.deck, player.holeCards, game.communityCards, 2);
      if (probabilityToWin > 0.5) {
        return amountToCall;
      }
      else {
        return 0;
      }
    }
    else if (game.phase == 'flop') {
      let probabilityToWin = this.s.percentToWin(game.deck, player.holeCards, game.communityCards, 2);
      return amountToCall;
    }
    else {
      return amountToCall;
    }
  }
}
