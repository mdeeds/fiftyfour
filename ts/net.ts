import { Strategy } from "./strategy";
import { Score } from "./score";
import { GameState } from "./gameState";
import { GamePhase } from "./holdEm";
import { Train } from "./train";

export class Net implements Strategy {
  s: Score;
  t: Train;

  constructor(maxBet: number = 10) {
    this.s = new Score();
    this.t = new Train();
    this.t.buildModel(4, 1);
    this.t.loadModel();
  }

  action(game: GameState): number {
    let chanceToWin = this.s.percentToWin(game.inDeck, game.playerHoleCards, game.communityCards, 2);
    let chipsInPot = game.chipsInPot;
    let currentBet = game.currentBet;

    let predictedWinnings: Array<number> = new Array<number>();
    for (let bet = 0; bet < 20; bet++) {
      let input = [chipsInPot, chanceToWin, bet, currentBet];
      predictedWinnings.push(this.t.getAction(input)[0]);
    }
    let index = predictedWinnings.indexOf(Math.max(...predictedWinnings));
    let bet = index;

    return bet;
  }
}
