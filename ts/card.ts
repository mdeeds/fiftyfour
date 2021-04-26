
export type Suit = 'C' | 'D' | 'H' | 'S';

export class Card {
  static suits: Suit[] = ['C', 'D', 'H', 'S'];

  private div: HTMLDivElement;
  private suit: Suit;
  private rank: number;

  constructor(suit: Suit, rank: number,
    container: HTMLDivElement | HTMLBodyElement) {
    this.div = document.createElement('div');
    this.suit = suit;
    this.rank = rank;
    this.setFace();
    container.appendChild(this.div);
  }

  public getSuit() {
    return this.suit;
  }

  public getPip() {
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
    return pip;
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