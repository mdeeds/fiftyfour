import { HoldEm } from "./holdEm";
import { Perf } from "./perf";

function constructorTest() {
  const startTime = Perf.now();
  var game: HoldEm = new HoldEm(1000, 2);
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);
  console.assert(game.getNumPlayers() === 2);
}

function playRoundTest() {
  var game: HoldEm = new HoldEm(1000, 2);
  const startTime = Perf.now();
  game.playRound();
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);
}

constructorTest();
playRoundTest();
let stop = 0;


