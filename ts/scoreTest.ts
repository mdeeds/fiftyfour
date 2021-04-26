import { Score } from "./score";
import { Perf } from "./perf";
import { Card } from "./card";
import { CardStub } from "./cardStub";

function constructorTest() {
  const startTime = Perf.now();
  var s: Score = new Score();
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);
  console.assert(s.scoreTable.size === 7462);
}

function scoreTest() {
  var s: Score = new Score();

  const card1 = new CardStub('C', 1);
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

  console.assert(score === 7462);
}

constructorTest();
scoreTest();