import { AlwaysCall } from "./alwaysCall";
import { AlwaysBet } from "./alwaysBet";
import { HoldEm } from "./holdEm";
import { Perf } from "./perf";
import { Player } from "./player";

function playRoundTest() {
  let players = new Array<Player>();

  let p1: Player = new Player();
  p1.name = "Matt";
  p1.strat = new AlwaysCall();
  players.push(p1);

  let p2: Player = new Player();
  p2.name = "Steve";
  p2.strat = new AlwaysBet();
  players.push(p2);

  var game: HoldEm = new HoldEm(1000, players);
  const startTime = Perf.now();
  game.playRound();
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);
}

playRoundTest();
let stop = 0;


