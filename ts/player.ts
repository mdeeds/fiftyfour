import { Card } from "./card";
import { Strategy } from "./strategy";

export class Player {
  public name: string;
  readonly holeCards: Array<Card> = new Array<Card>();
  public chips: number;
  public isFolded: boolean;
  public strat: Strategy;
  public betThisRound: number;

  constructor() {
    this.isFolded = false;
    this.betThisRound = 0;
    this.chips = 0;
  }
}