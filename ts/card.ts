export type Suit = 'C' | 'D' | 'H' | 'S';

export interface Card {
  readonly suit: Suit;
  readonly rank: number;
  readonly pip: string;
}