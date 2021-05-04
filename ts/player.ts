import { Card } from "./card";
import { Strategy } from "./strategies/strategy";

export class Player {
  static createNewPlayers(numberOfPlayers: number) {
    const players: Player[] = [];
    for (let i = 0; i < numberOfPlayers; ++i) {
      players.push(new Player());
    }
    return players;
  }

  private static names = ['Abigail', 'Bob', 'Charlotte', 'Doogle', 'Eddie',
    'Francine', 'Gary', 'Herman', 'Izzie', 'Jack', 'Kili'];
  private static nameIndex = 0;

  public name: string;
  public holeCards: Array<Card> = new Array<Card>();
  public chips: number;
  public isFolded: boolean;
  public strat: Strategy;
  public betThisRound: number;

  constructor() {
    this.name = Player.names[Player.nameIndex];
    ++Player.nameIndex;
    this.isFolded = false;
    this.betThisRound = 0;
    this.chips = 0;
  }
}