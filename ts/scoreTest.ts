import { Score } from "./score";
import { Perf } from "./perf";
import { Card } from "./card";

function constructorTest() {
    const startTime = Perf.now();
    var s: Score = new Score();
    console.log(`Elapsed ms: ${Perf.now() - startTime}`);
    console.assert(s.scoreTable.size === 7462);
}

function scoreTest() {
    const body = document.getElementsByTagName('body')[0];

    var s: Score = new Score();

    const card1 = new Card(Card.suits[0], 1, body);
    const card2 = new Card(Card.suits[0], 10, body);
    const card3 = new Card(Card.suits[0], 11, body);
    const card4 = new Card(Card.suits[0], 12, body);
    const card5 = new Card(Card.suits[0], 13, body);

    var hand: Array<Card> = new Array<Card>();
    hand.push(card1);
    hand.push(card2);
    hand.push(card3);
    hand.push(card4);
    hand.push(card5);

    const startTime = Perf.now();
    let score = s.scoreHand(hand)
    console.log(`Elapsed ms: ${Perf.now() - startTime}`);

    console.assert(score === 7462);
}

constructorTest();
scoreTest();