import { Deck } from "./deck";
import { Player } from "./player";
import { VisibleCard } from "./visibleCard";

const body = document.getElementsByTagName('body')[0];

const players = Player.createNewPlayers(5);

const community = document.createElement('div');
community.classList.add('cardSet');
body.appendChild(community);
const playerCards = document.createElement('div');
playerCards.classList.add('cardSet');
body.appendChild(playerCards);
const offscreen = document.createElement('div');
body.appendChild(offscreen);

const cards = VisibleCard.pokerDeck(offscreen);
const deck = new Deck<VisibleCard>(cards);
deck.shuffle();

deck.pop().moveTo(playerCards);
deck.pop().moveTo(playerCards);
deck.pop().moveTo(community);
deck.pop().moveTo(community);
deck.pop().moveTo(community);
deck.pop().moveTo(community);
deck.pop().moveTo(community);
