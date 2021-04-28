import { Card } from "./card";

export class Player {
  static createNewPlayers(numberOfPlayers: number) {
    const players: Player[] = [];
    for (let i = 0; i < numberOfPlayers; ++i) {
      players.push(new Player());
    }
    return players;
  }
  readonly name: string;
  readonly holeCards: Array<Card> = new Array<Card>();
  public chips: number;
  readonly isFolded: boolean;

  constructor() {
    this.isFolded = false;
  }
}