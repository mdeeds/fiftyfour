import { AlwaysCall } from "./strategies/alwaysCall";
import { Random } from "./random";
import { BigAce } from "./strategies/bigAce";
import { HoldEm } from "./holdEm";
import { Perf } from "./perf";
import { Player } from "./player";
import { Deck } from "./deck";
import { PotOdds } from "./strategies/potOdds";
import { AlwaysBet } from "./strategies/alwaysBet";
import { appendFileSync } from "fs";
import { Net } from "./strategies/net"

function playRoundTest() {
  let players = new Array<Player>();

  for (let i = 0; i < 2; i++) {
    let p: Player = new Player();
    p.strat = new PotOdds(0, 20);
    p.name = "Pot Odds" + i.toString();
    players.push(p);
  }
  for (let i = 0; i < 2; i++) {
    let p: Player = new Player();
    p.strat = new Net(10);
    p.name = "Net " + i.toString();
    players.push(p);
  }

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


