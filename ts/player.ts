import { Card } from "./card";

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

  readonly name: string;
  readonly holeCards: Array<Card> = new Array<Card>();
  public chips: number;
  readonly isFolded: boolean;

  constructor() {
    this.name = Player.names[Player.nameIndex];
    ++Player.nameIndex;
    this.isFolded = false;
  }
}