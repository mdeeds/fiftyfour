import { Strategy } from "./strategy";
import { Score } from "../score";
import { GameState } from "../gameState";
import { GamePhase } from "../holdEm";
import { Train, TrainingPair } from "../train";

export class Net implements Strategy {
  s: Score;
  t: Train;
  maxBet: number;

  constructor(maxBet: number = 20) {
    this.maxBet = maxBet;
    this.s = new Score();
    this.t = new Train();
    this.t.buildModel(4, 1);
    this.t.loadModel();
  }

  action(game: GameState): number {
    let tp: TrainingPair = new TrainingPair();
    tp.gameState = game;

    let predictedWinnings: Array<number> = new Array<number>();
    for (let bet = 0; bet < this.maxBet; bet++) {
      tp.gameState.action = bet;
      let input = tp.getInput();
      predictedWinnings.push(this.t.getAction(input)[0]);
    }
    let index = predictedWinnings.indexOf(Math.max(...predictedWinnings));
    let bet = index;

    return bet;
  }
}
