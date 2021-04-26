import { VisibleCard } from "./visibleCard";

const body = document.getElementsByTagName('body')[0];

for (const suit of VisibleCard.suits) {
  for (let rank = 1; rank <= 13; ++rank) {
    const card = new VisibleCard(suit, rank, body);
  }
}