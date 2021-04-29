import { AlwaysCall } from "./alwaysCall";
import { AlwaysBet } from "./alwaysBet";
import { HoldEm } from "./holdEm";
import { Perf } from "./perf";
import { Player } from "./player";
import { Deck } from "./deck";

function playRoundTest() {
  let players = new Array<Player>();

  let p1: Player = new Player();
  p1.strat = new AlwaysCall();
  players.push(p1);

  let p2: Player = new Player();
  p2.strat = new AlwaysBet();
  players.push(p2);

  var game: HoldEm = new HoldEm(1000, players, Deck.pokerDeckStubs());
  const startTime = Perf.now();
  for (let i = 0; i < 1000; i++) {
    game.playRound();
  }
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);
}

playRoundTest();
let stop = 0;


