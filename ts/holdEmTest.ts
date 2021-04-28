import { Deck } from "./deck";
import { HoldEm } from "./holdEm";
import { Perf } from "./perf";

function constructorTest() {
  console.log('constructorTest');
  const startTime = Perf.now();
  const cards = Deck.pokerDeckStubs();
  var game: HoldEm = new HoldEm(1000, 2, cards);
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);
  console.assert(game.getNumPlayers() === 2);
}

function playRoundTest() {
  console.log('playRoundTest');
  const cards = Deck.pokerDeckStubs();
  var game: HoldEm = new HoldEm(1000, 2, cards);
  const startTime = Perf.now();
  game.playRound();
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);
}

constructorTest();
playRoundTest();
let stop = 0;


