import { Player } from "./player";
import { Card } from "./card";
import { Deck } from "./deck";
import { GamePhase } from "./holdEm";

export class GameState {
  readonly playerChips: number;
  readonly playerHoleCards: Array<Card>;
  readonly playerBetThisRound: number;
  readonly communityCards: Array<Card> = new Array<Card>();
  readonly chipsInPot: number;
  readonly phase: GamePhase;
  readonly dealerIndex: number;
  readonly currentPlayerIndex;
  readonly currentBet;
  readonly inDeck: Array<Card>;
  readonly numPlayers: number;
  public action: number;

  constructor(
    player: Player,
    communityCards: Array<Card>,
    chipsInPot: number,
    phase: GamePhase,
    dealerIndex: number,
    currentPlayerIndex,
    currentBet,
    deck: Deck<Card>,
    numPlayers: number
  ) {
    this.playerChips = player.chips;
    this.playerHoleCards = player.holeCards;
    this.playerBetThisRound = player.betThisRound;
    this.communityCards = communityCards;
    this.chipsInPot = chipsInPot;
    this.phase = phase;
    this.dealerIndex = dealerIndex;
    this.currentPlayerIndex = currentPlayerIndex;
    this.currentBet = currentBet;
    this.inDeck = deck.getInDeck();
    this.numPlayers = numPlayers;
  }
}

