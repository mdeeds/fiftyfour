import { AlwaysCall } from "./alwaysCall";
import { BigAce } from "./bigAce";
import { HoldEm } from "./holdEm";
import { Perf } from "./perf";
import { Player } from "./player";
import { Deck } from "./deck";
import { PotOdds } from "./potOdds";
import { AlwaysBet } from "./alwaysBet";
import { appendFileSync } from "fs";
import { Net } from "./net"

function playRoundTest() {
  let players = new Array<Player>();

  // let p1: Player = new Player();
  // p1.strat = new AlwaysCall();
  // p1.name = "Always Calla";
  // players.push(p1);

  let p2: Player = new Player();
  p2.strat = new PotOdds(0.25, 10);
  p2.name = "PotOdds 25%a";
  players.push(p2);

  // let p3: Player = new Player();
  // p3.strat = new BigAce();
  // p3.name = "Big Acea";
  // players.push(p3);

  // let p4: Player = new Player();
  // p4.strat = new AlwaysBet();
  // p4.name = "Always Beta";
  // players.push(p4);

  // let p5: Player = new Player();
  // p5.strat = new AlwaysCall();
  // p5.name = "Always Callb";
  // players.push(p5);

  let p6: Player = new Player();
  p6.strat = new PotOdds(0.25, 10);
  p6.name = "PotOdds 25%b";
  players.push(p6);

  // let p7: Player = new Player();
  // p7.strat = new BigAce();
  // p7.name = "Big Aceb";
  // players.push(p7);

  // let p8: Player = new Player();
  // p8.strat = new AlwaysBet();
  // p8.name = "Always Betb";
  // players.push(p8);

  let p9: Player = new Player();
  p9.strat = new PotOdds(0, 10);
  p9.name = "PotOdds 0%a";
  players.push(p9);

  let p10: Player = new Player();
  p10.strat = new Net(0);
  p10.name = "Neural Net";
  players.push(p10);

  var game: HoldEm = new HoldEm(1000, players, Deck.pokerDeckStubs());
  const startTime = Perf.now();
  let data: string = "";
  for (let player of game.players) {
    data += player.name + ","
  }
  data += '\n';
  appendFileSync('scores.csv', data);
  for (let i = 0; i < 1000; i++) {
    console.log(`*** Hand ${i} ***`);
    game.playRound();
    let data: string = "";
    for (let player of game.players) {
      data += player.chips + ","
    }
    data += '\n';
    appendFileSync('scores.csv', data);
  }
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);
}

playRoundTest();
let stop = 0;


