import { Card } from "./card";
import { Deck } from "./deck";
import { Player } from "./player";
import { Score } from "./score";

export type GamePhase = 'pre-flop' | 'flop' | 'turn' | 'river';

export class HoldEm {
  private players: Array<Player> = new Array<Player>();
  private communityCards: Array<Card> = new Array<Card>();
  private chipsInPot: number;
  private phase: GamePhase;
  private dealerIndex: number;
  private currentPlayerIndex;

  constructor(buyIn: number, numberOfPlayers: number) {
    this.dealerIndex = 0;
    this.currentPlayerIndex = 1;
    this.chipsInPot = 0;
    this.phase = 'pre-flop';
    for (let i = 0; i < numberOfPlayers; i++) {
      var p: Player = new Player()
      p.chips = buyIn;
      this.players.push(p);
    }
  }

  private nextPlayer() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  public getNumPlayers() {
    return this.players.length;
  }

  public playRound() {
    const cards = Deck.pokerDeckStubs();
    const deck = new Deck<Card>(cards);
    deck.shuffle();

    this.phase = 'pre-flop';
    this.dealHoleCards(deck);
    this.Actions(deck);
    this.phase = 'flop';
    this.dealFlop(deck);
    this.Actions(deck);
    this.phase = 'turn';
    this.dealOne(deck);
    this.Actions(deck);
    this.phase = 'river';
    this.dealOne(deck);
    this.Actions(deck);
    this.showdown();
  }

  private bet(playerIndex: number, amount: number) {
    this.chipsInPot += amount;
    this.players[playerIndex].chips -= amount;
  }

  private dealHoleCards(deck: Deck<Card>) {
    this.players.forEach(p => {
      p.holeCards.push(deck.pop());
      p.holeCards.push(deck.pop());
    });
    // small blind
    this.bet(this.currentPlayerIndex, 1);
    this.nextPlayer();
    // big blind
    this.bet(this.currentPlayerIndex, 2);
    this.nextPlayer();
  }

  private Actions(deck: Deck<Card>) {
    var playing = 0;
    for (const p of this.players) {
      if (!p.isFolded) {
        playing++;
      }
    }
    if (playing <= 1) {
      return;
    }

    var needActions = this.players.length;
    while (needActions > 0) {
      let p = this.players[this.currentPlayerIndex];
      if (!p.isFolded) {
        // TODO: call model for the player and do stuff. ************
        console.log(`player Index ${this.currentPlayerIndex}. phase ${this.phase}`);
      }
      this.nextPlayer();
      needActions--;
    }
  }

  private dealFlop(deck: Deck<Card>) {
    this.communityCards.push(deck.pop());
    this.communityCards.push(deck.pop());
    this.communityCards.push(deck.pop());
  }

  private dealOne(deck: Deck<Card>) {
    this.communityCards.push(deck.pop());
  }

  private showdown() {
    var s: Score = new Score();
    var playerScores: Array<number> = new Array<number>();
    for (const p of this.players) {
      playerScores.push(s.bestHand(p.holeCards.concat(this.communityCards)));
    };
    const winner = playerScores.indexOf(Math.max(...playerScores));
    this.players[winner].chips += this.chipsInPot;
    this.chipsInPot = 0;

    console.log(`winner is ${winner} with ${playerScores[winner]}`);
    for (const p of this.players) {
      console.log(`player ${p.name} has ${p.chips} chips.`);
    };
  }
}