import { Card } from "./card";
import { Deck } from "./deck";
import { GameState } from "./gameState";
import { Player } from "./player";
import { Score } from "./score";
import { StorageUtil } from "./storageUtil";
import { TrainingPair } from "./train";

export enum GamePhase{
  preflop = "pre-flop",
  flop = "flop",
  turn = "turn",
  river = "river",
}

export class HoldEm {
  readonly players: Array<Player> = new Array<Player>();
  private communityCards: Array<Card> = new Array<Card>();
  private chipsInPot: number;
  private phase: GamePhase;
  private dealerIndex: number;
  private currentPlayerIndex;
  private currentBet;
  private needActions: number;
  private deck: Deck<Card>;

  constructor(buyIn: number, players: Player[], cards: Card[]) {
    this.deck = new Deck<Card>(cards);
    this.players = players;
    this.dealerIndex = 0;
    this.currentPlayerIndex = 1;
    this.chipsInPot = 0;
    this.phase = GamePhase.preflop
    this.currentBet = 0;
    this.players = players;
    this.needActions = players.length;
    for (const player of players) {
      player.chips = buyIn;
    }
  }

  public getChipsInPot() {
    return this.chipsInPot;
  }

  public getDeck() {
    return this.deck;
  }
  public getCommunityCards() {
    return this.communityCards;
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

  private nextDealer() {
    this.dealerIndex = (this.dealerIndex + 1) % this.players.length;
  }

  public getNumPlayers() {
    return this.players.length;
  }

  public playRound(){

    let gameStates: Array<GameState> = new Array<GameState>();
    let startingChips: Array<number> = new Array<number>();
    for (let p of this.players){
      startingChips.push(p.chips);
    }

    this.currentPlayerIndex = this.dealerIndex;
    this.reset();
    this.phase = GamePhase.preflop;
    this.dealHoleCards();
    this.Actions(gameStates);
    this.phase = GamePhase.flop;
    this.dealFlop();
    this.Actions(gameStates);
    this.phase = GamePhase.turn;
    this.dealOne();
    this.Actions(gameStates);
    this.phase = GamePhase.river;
    this.dealOne();
    this.Actions(gameStates);
    let winner: number = this.showdown();
    this.nextDealer();

    let winnings: Array<number> = new Array<number>();
    for (let i=0; i< this.players.length; i++){
      winnings.push(this.players[i].chips - startingChips[i]);
    }

    let trainingPairs: Array<TrainingPair> = new Array<TrainingPair>();
    for (let gs of gameStates){
      let tp = new TrainingPair();
      tp.gameState = gs;
      tp.amountWon = winnings[gs.currentPlayerIndex];
      trainingPairs.push(tp);
    }

    StorageUtil.saveObject(`./training/${Math.round(Math.random() * 100000)}`, trainingPairs);
  }

  private reset() {
    this.communityCards = [];
    for (const p of this.players) {
      p.holeCards = [];
      p.isFolded = false;
    }
    this.deck.recombine();
    this.deck.shuffle();
  }

  private bet(amount: number) {
    // amount must be in increments of the small blind.
    amount = Math.round(amount);
    // you can only bet up to what you have.
    amount = Math.min(this.players[this.currentPlayerIndex].chips, amount)
    // bet cannon be negative
    amount = Math.max(0, amount);
    // is it a check?
    let amountToCall = this.currentBet - this.getCurrentPlayer().betThisRound;
    if (amount < amountToCall && amountToCall > 0) {
      console.log(`${this.players[this.currentPlayerIndex].name} folds.`);
      this.players[this.currentPlayerIndex].isFolded = true;
      return;
    }
    //is it a fold?
    if (amount == 0 && amountToCall == 0) {
      console.log(`${this.players[this.currentPlayerIndex].name} checks.`);
      return;
    }

    if (amount == amountToCall) {
      console.log(`${this.players[this.currentPlayerIndex].name} calls with ${amount}.`);
    }
    else {
      console.log(`${this.players[this.currentPlayerIndex].name} bets ${amount}.`);
      this.needActions = this.players.length;
    }
    this.chipsInPot += amount;
    this.players[this.currentPlayerIndex].chips -= amount;
    this.players[this.currentPlayerIndex].betThisRound += amount;
    this.currentBet = this.players[this.currentPlayerIndex].betThisRound;
    console.log(`The current bet is ${this.currentBet}. There are ${this.chipsInPot} chips in the pot.`);
  }

  private dealHoleCards() {
    this.players.forEach(p => {
      p.holeCards.push(this.deck.pop());
      p.holeCards.push(this.deck.pop());
    });
    // small blind
    this.bet(1);
    this.nextPlayer();
    // big blind
    this.bet(2);
    this.nextPlayer();
  }

  private onePlayerLeftStanding() {
    let numberPlaying = 0;
    for (const p of this.players) {
      if (!p.isFolded) {
        numberPlaying++;
      }
    }
    return numberPlaying <= 1;
  }

  private Actions(gameStates: Array<GameState>) {
    if (this.onePlayerLeftStanding()) {
      return;
    }

    console.log(this.phase);
    this.needActions = this.players.length;
    while (this.needActions > 0) {
      let p = this.players[this.currentPlayerIndex];
      if (!p.isFolded) {
        // the stratagy may be more interested in the number of players that have not folded.
        let gs: GameState = this.getGameState();
        let amount = p.strat.action(gs);
        this.bet(amount);
        gs.action = amount;
        gameStates.push(gs);
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

  private getGameState(): GameState {
    let gs: GameState = new GameState(
      this.getCurrentPlayer(),
      this.communityCards,
      this.chipsInPot,
      this.phase,
      this.dealerIndex,
      this.currentPlayerIndex,
      this.currentBet,
      this.deck,
      this.getNumPlayers());
    return gs;
  }

  private dealFlop() {
    this.communityCards.push(this.deck.pop());
    this.communityCards.push(this.deck.pop());
    this.communityCards.push(this.deck.pop());
  }

  private dealOne() {
    this.communityCards.push(this.deck.pop());
  }

  private showdown() {
    console.log(`showdown`);
    let s: Score = new Score();
    let playerScores: Array<number> = new Array<number>();
    for (const p of this.players) {
      let score = 0;
      if (!p.isFolded) {
        score = s.bestHand(p.holeCards.concat(this.communityCards));
      }
      playerScores.push(score);
    }
    const winningScore = Math.max(...playerScores);
    const numWinners = playerScores.filter(score => score == winningScore).length;
    let eachWinnerGets = this.chipsInPot / numWinners;
    let winner = -1;
    for (let i = 0; i < playerScores.length; i++) {
      if (playerScores[i] == winningScore) {
        this.players[i].chips += eachWinnerGets;
        console.log(`winner is ${this.players[i].name} with a hand score of ${playerScores[i]}`);
        winner = i;
      }
    }
    this.chipsInPot = 0;
    for (const p of this.players) {
      console.log(`player ${p.name} has ${p.chips} chips.`);
    }
    return winner;
  }
}