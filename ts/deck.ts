import { Card } from "./card";
import { CardStub } from "./cardStub";
import { VisibleCard } from "./visibleCard";

export class Deck<T> {
  private inDeck: T[];
  private dealt: T[];

  static pokerDeckStubs(): Card[] {
    const cards: Card[] = [];
    for (const suit of VisibleCard.suits) {
      for (let rank = 2; rank <= 14; ++rank) {
        cards.push(new CardStub(suit, rank));
      }
    }
    return cards;
  }

  getInDeck(){
    return this.inDeck;
  }

  constructor(content: T[]) {
    // Shallow copy of the content.
    this.inDeck = content.slice();
    this.dealt = [];
  }

  remove(card: T) {
    const i = this.inDeck.indexOf(card);
    if (i < 0) {
      throw new Error(`Card not found in deck: ${card}`);
    }
    this.dealt.push(this.inDeck[i]);
    this.inDeck.slice(i, 1);
  }

  removeCards(cards: Array<T>) {
    cards.forEach(c => {
      this.remove(c);
    })
  }

  shuffle() {
    const n = this.inDeck.length;
    for (let i = 0; i < this.inDeck.length; ++i) {
      const toPosition = Math.trunc(Math.random() * (n - i) + i);
      const t = this.inDeck[i];
      this.inDeck[i] = this.inDeck[toPosition];
      this.inDeck[toPosition] = t;
    }
  }

  pop(): T {
    const result = this.inDeck.pop();
    this.dealt.push(result);
    return result;
  }

  recombine() {
    this.inDeck.push(...this.dealt);
    this.dealt.splice(0);
  }
}