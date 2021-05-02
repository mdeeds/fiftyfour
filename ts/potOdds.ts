import { Strategy } from "./strategy";
import { HoldEm } from "./holdEm";
import { Score } from "./score";
import { GameState } from "./gameState";

export class PotOdds implements Strategy {
  private s: Score;
  private threshold: number;
  private maxBet: number;

  constructor(threshold: number = 0, maxBet: number = 10) {
    this.s = new Score();
    this.threshold = threshold;
    this.maxBet = maxBet;
  }

  action(game: GameState): number {
    let amountToCall = game.currentBet - game.playerBetThisRound;
    let probabilityToWin = this.s.percentToWin(game.inDeck, game.playerHoleCards, game.communityCards, game.numPlayers);
    console.log(`Player has a ${probabilityToWin * 100}% probability to win.`);
    if (probabilityToWin < this.threshold) {
      return 0;
    }
    else {
      var bet;
      if (game.playerBetThisRound > 0) {
        bet = amountToCall;
      }
      else {
        bet = probabilityToWin * game.chipsInPot;
        bet = Math.min(bet, this.maxBet)
      }
      return bet;
    }
  }
}
