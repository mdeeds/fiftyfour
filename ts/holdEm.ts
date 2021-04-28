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
  private currentBet;
  private needActions: number;

  constructor(buyIn: number, players: Array<Player>) {
    this.dealerIndex = 0;
    this.currentPlayerIndex = 1;
    this.chipsInPot = 0;
    this.phase = 'pre-flop';
    this.currentBet = 0;
    this.players = players;
    this.needActions = players.length;
    this.players.forEach(p => {
      p.chips = buyIn;
    });
  }

  public getCurrentBet() {
    return this.currentBet;
  }

  public getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
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

  private bet(amount: number) {
    // amount must be in increments of the small blind.
    amount = Math.round(amount);
    let amountToCall = this.currentBet - this.getCurrentPlayer().betThisRound;
    if (amount <= 0) {
      return;
    }
    if (this.players[this.currentPlayerIndex].chips < amount) {
      return;
    }
    if (amount < amountToCall) {
      return;
    }
    if (amount == amountToCall) {
      console.log(`${this.players[this.currentPlayerIndex].name} calls with ${amount}`);
    }
    else {
      console.log(`${this.players[this.currentPlayerIndex].name} bets ${amount}`);
    }
    this.currentBet = amount;
    this.chipsInPot += amount;
    this.players[this.currentPlayerIndex].chips -= amount;
    this.players[this.currentPlayerIndex].betThisRound += amount;
    this.needActions = this.players.length;
  }

  private dealHoleCards(deck: Deck<Card>) {
    this.players.forEach(p => {
      p.holeCards.push(deck.pop());
      p.holeCards.push(deck.pop());
    });
    // small blind
    this.bet(1);
    this.nextPlayer();
    // big blind
    this.bet(2);
    this.nextPlayer();
  }

  private Actions(deck: Deck<Card>) {
    var playing = 0;
    this.players.forEach(p => {
      if (!p.isFolded) {
        playing++;
      }
    });
    if (playing <= 1) {
      return;
    }

    console.log(this.phase);
    this.needActions = this.players.length;
    while (this.needActions > 0) {
      let p = this.players[this.currentPlayerIndex];
      if (!p.isFolded) {
        var amount = p.strat.action(this);
        let amoutToCall = this.currentBet - this.getCurrentPlayer().betThisRound;
        if (amount < amoutToCall) {
          console.log(`${this.players[this.currentPlayerIndex].name} folds.`);
          this.getCurrentPlayer().isFolded = true;
        }
        else {
          this.bet(amount);
        }
      }
      this.nextPlayer();
      this.needActions--;
    }
    // sweep everything into the pot
    this.currentBet = 0;
    this.players.forEach(p => {
      p.betThisRound = 0;
    });
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
    this.players.forEach(p => {
      playerScores.push(s.bestHand(p.holeCards.concat(this.communityCards)));
    });
    var winner = playerScores.indexOf(Math.max(...playerScores));
    this.players[winner].chips += this.chipsInPot;
    this.chipsInPot = 0;

    console.log(`winner is ${this.players[winner].name} with a hand score of ${playerScores[winner]}`);
    this.players.forEach(p => {
      console.log(`player ${p.name} has ${p.chips} chips.`);
    });
  }
}