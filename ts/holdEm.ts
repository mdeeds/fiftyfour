import { Card } from "./card";
import { Deck } from "./deck";
import { Player } from "./player";
import { Score } from "./score";

export type GamePhase = 'pre-flop' | 'flop' | 'turn' | 'river';

export class HoldEm {
  private players: Array<Player> = new Array<Player>();
  private communityCards: Array<Card> = new Array<Card>();
  private phase: GamePhase;
  private dealerIndex: number;

  constructor(buyIn: number, numberOfPlayers: number) {
    this.dealerIndex = 0;
    this.phase = 'pre-flop';
    for (let i = 0; i < numberOfPlayers; i++) {
      var p: Player = new Player()
      p.chips = buyIn;
      this.players.push(p);
    }
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

  private dealHoleCards(deck: Deck<Card>) {
    this.players.forEach(p => {
      p.holeCards.push(deck.pop());
      p.holeCards.push(deck.pop());
    });
  }

  private Actions(deck: Deck<Card>) {

    this.players.forEach(p => {
      if (!p.isFolded) {

      }
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
  }

}