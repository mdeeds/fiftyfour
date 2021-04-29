import { AlwaysCall } from "./alwaysCall";
import { AlwaysBet } from "./alwaysBet";
import { HoldEm } from "./holdEm";
import { Perf } from "./perf";
import { Player } from "./player";
import { Deck } from "./deck";
import { PotOdds } from "./potOdds";

function playRoundTest() {
  let players = new Array<Player>();

  let p1: Player = new Player();
  p1.strat = new PotOdds(0, 10);
  p1.name = "PotOdds 0%"
  players.push(p1);

  let p2: Player = new Player();
  p2.strat = new PotOdds(0.25, 10);
  p2.name = "PotOdds 25%";
  //p2.strat = new AlwaysCall();
  //p2.name = "Always Call";
  players.push(p2);

  var game: HoldEm = new HoldEm(1000, players, Deck.pokerDeckStubs());
  const startTime = Perf.now();
  for (let i = 0; i < 1000; i++) {
    console.log(`*** Hand ${i} ***`);
    game.playRound();
  }
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);
}

playRoundTest();
let stop = 0;


