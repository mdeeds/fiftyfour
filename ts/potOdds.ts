import { Strategy } from "./strategy";
import { HoldEm } from "./holdEm";
import { Score } from "./score";
import { GameState } from "./gameState";

export class PotOdds implements Strategy {
  s: Score;
  threshold: number;
  maxBet: number;

  constructor(threshold: number = 0, maxBet: number = 10) {
    this.s = new Score();
    this.threshold = threshold;
    this.maxBet = maxBet;
  }

  action(game: GameState): number {
    let player = game.player;
    let amountToCall = game.currentBet - player.betThisRound;
    let probabilityToWin = this.s.percentToWin(game.deck.getInDeck(), player.holeCards, game.communityCards, game.numPlayers);
    console.log(`${player.name} has a ${probabilityToWin * 100}% probability to win.`);
    if (probabilityToWin < this.threshold) {
      return 0;
    }
    else {
      var bet;
      if (player.betThisRound > 0) {
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
