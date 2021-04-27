import { Card } from "./card";
import { Deck } from "./deck";

function poke() {
  const cards = Deck.pokerDeckStubs();

  const aCard = cards[0];
  const bCard = cards[1];

  const deck = new Deck<Card>(cards);
  deck.remove(aCard);
  deck.shuffle();
  deck.remove(bCard);
  const cCard = deck.pop();

  console.log(`${JSON.stringify(aCard)}`);
  console.log(`${JSON.stringify(bCard)}`);
  console.log(`${JSON.stringify(cCard)}`);
}

poke();