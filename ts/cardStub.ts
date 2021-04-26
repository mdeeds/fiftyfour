import { Card } from "./card";
import { Suit, VisibleCard } from "./visibleCard";

export class CardStub implements Card {
  readonly suit: Suit;
  readonly rank: number;
  readonly pip: string;

  constructor(suit: Suit, rank: number) {
    this.suit = suit;
    this.rank = rank;
    this.pip = VisibleCard.getPip(rank);
  }
}