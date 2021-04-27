import { Card } from "./card";

export class Player {
  readonly name: string;
  readonly holeCards: Array<Card> = new Array<Card>();
  public chips: number;
  readonly isFolded: boolean;

  constructor() {
    this.isFolded = false;
  }
}