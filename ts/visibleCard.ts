import { Card } from "./card";

export type Suit = 'C' | 'D' | 'H' | 'S';

export class VisibleCard implements Card {
  static suits: Suit[] = ['C', 'D', 'H', 'S'];
  static getPip(rank: number) {
    let pip = rank.toFixed(0);
    if (rank === 1) {
      pip = 'A';
    } else if (rank === 10) {
      pip = 'T'
    } else if (rank === 11) {
      pip = 'J'
    } else if (rank === 12) {
      pip = 'Q'
    } else if (rank === 13) {
      pip = 'K'
    }
    return pip;
  }

  private div: HTMLDivElement;
  readonly suit: Suit;
  readonly rank: number;
  readonly pip: string;

  constructor(suit: Suit, rank: number,
    container: HTMLDivElement | HTMLBodyElement) {
    this.div = document.createElement('div');
    this.suit = suit;
    this.rank = rank;
    this.pip = VisibleCard.getPip(rank);
    this.setFace();
    container.appendChild(this.div);
  }

  public getSuit() {
    return this.suit;
  }

  public getPip() {
  }

  private setFace() {
    this.div.classList.add('card');
    let pip = this.rank.toFixed(0);
    if (this.rank === 1) {
      pip = 'A';
    } else if (this.rank === 11) {
      pip = 'J'
    } else if (this.rank === 12) {
      pip = 'Q'
    } else if (this.rank === 13) {
      pip = 'K'
    }
    let suit = '';
    switch (this.suit) {
      case 'C':
        suit = '&#9827;';
        this.div.classList.add('black');
        break;
      case 'D':
        suit = '&#9830;';
        this.div.classList.add('red');
        break;
      case 'H':
        suit = '&#9829;';
        this.div.classList.add('red');
        break;
      case 'S':
        suit = '&#9824;';
        this.div.classList.add('black');
        break;
    }
    this.div.innerHTML = `${pip}${suit}`;
  }
}