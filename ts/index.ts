import { VisibleCard } from "./visibleCard";

const body = document.getElementsByTagName('body')[0];

for (const suit of VisibleCard.suits) {
  for (let rank = 2; rank <= 14; ++rank) {
    const card = new VisibleCard(suit, rank, body);
  }
}