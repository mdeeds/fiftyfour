import { Card } from "./card";

const body = document.getElementsByTagName('body')[0];

for (const suit of Card.suits) {
  for (let rank = 1; rank <= 13; ++rank) {
    const card = new Card(suit, rank, body);
  }
}