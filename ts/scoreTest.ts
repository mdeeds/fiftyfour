import { Score } from "./score";
import { Perf } from "./perf";
import { Card } from "./card";
import { CardStub } from "./cardStub";
import { Deck } from "./deck";

function constructorTest() {
  console.log("constructorTest");
  const startTime = Perf.now();
  var s: Score = new Score();
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);
}

function scoreTest() {
  console.log("scoreTest");
  var s: Score = new Score();

  const card1 = new CardStub('C', 14);
  const card2 = new CardStub('C', 10);
  const card3 = new CardStub('C', 11);
  const card4 = new CardStub('C', 12);
  const card5 = new CardStub('C', 13);

  var hand: Card[] = [];
  hand.push(card1);
  hand.push(card2);
  hand.push(card3);
  hand.push(card4);
  hand.push(card5);

  const startTime = Perf.now();
  let score = s.scoreHand(hand);
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);

  console.assert(score === 7462, `Actual: ${score}`);
}

function percentToWinTest() {
  console.log("percentToWinTest");
  var s: Score = new Score();
  const cards = Deck.pokerDeckStubs();
  const deck = new Deck<Card>(cards);
  deck.shuffle();
  const hand = new Array<Card>();
  const communityCards = new Array<Card>();

  hand.push(deck.pop());
  hand.push(deck.pop());

  communityCards.push(deck.pop());
  communityCards.push(deck.pop());
  communityCards.push(deck.pop());

  const startTime = Perf.now();
  let chance = s.percentToWin(deck.getInDeck(), hand, communityCards, 2);
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);
  console.assert(chance > 0 && chance < 1);
}

function bestHandTest() {
  console.log("bestHandTest");
  var s: Score = new Score();
  const hand: Array<Card> = new Array<Card>();
  hand.push(new CardStub('C', 14));
  hand.push(new CardStub('C', 13));
  hand.push(new CardStub('C', 12));
  hand.push(new CardStub('C', 11));
  hand.push(new CardStub('C', 10));
  hand.push(new CardStub('S', 7));
  hand.push(new CardStub('D', 2));

  const startTime = Perf.now();
  let score = s.bestHand(hand);
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);
  console.assert(score === 7462);
}

// function generateHoleCardLookupTest() {
//   var s: Score = new Score();
//   const startTime = Perf.now();
//   s.generateHoleCardLookup();
//   console.log(`Elapsed ms: ${Perf.now() - startTime}`);
//   console.assert(s.holeTable.size == 13 * 13);
// }

constructorTest();
scoreTest();
percentToWinTest();
bestHandTest();
//generateHoleCardLookupTest();