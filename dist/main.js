/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 363:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CardStub = void 0;
const visibleCard_1 = __webpack_require__(884);
class CardStub {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
        this.pip = visibleCard_1.VisibleCard.getPip(rank);
    }
}
exports.CardStub = CardStub;
//# sourceMappingURL=cardStub.js.map

/***/ }),

/***/ 14:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Deck = void 0;
const cardStub_1 = __webpack_require__(363);
const visibleCard_1 = __webpack_require__(884);
class Deck {
    constructor(content) {
        // Shallow copy of the content.
        this.inDeck = content.slice();
        this.dealt = [];
    }
    static pokerDeckStubs() {
        const cards = [];
        for (const suit of visibleCard_1.VisibleCard.suits) {
            for (let rank = 2; rank <= 14; ++rank) {
                cards.push(new cardStub_1.CardStub(suit, rank));
            }
        }
        return cards;
    }
    getInDeck() {
        return this.inDeck;
    }
    remove(card) {
        const i = this.inDeck.indexOf(card);
        if (i < 0) {
            throw new Error(`Card not found in deck: ${card}`);
        }
        this.dealt.push(this.inDeck[i]);
        this.inDeck.slice(i, 1);
    }
    removeCards(cards) {
        cards.forEach(c => {
            this.remove(c);
        });
    }
    shuffle() {
        const n = this.inDeck.length;
        for (let i = 0; i < this.inDeck.length; ++i) {
            const toPosition = Math.trunc(Math.random() * (n - i) + i);
            const t = this.inDeck[i];
            this.inDeck[i] = this.inDeck[toPosition];
            this.inDeck[toPosition] = t;
        }
    }
    pop() {
        const result = this.inDeck.pop();
        this.dealt.push(result);
        return result;
    }
    recombine() {
        this.inDeck.push(...this.dealt);
        this.dealt.splice(0);
    }
}
exports.Deck = Deck;
//# sourceMappingURL=deck.js.map

/***/ }),

/***/ 138:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
const deck_1 = __webpack_require__(14);
const player_1 = __webpack_require__(507);
const visibleCard_1 = __webpack_require__(884);
const body = document.getElementsByTagName('body')[0];
const players = player_1.Player.createNewPlayers(5);
const community = document.createElement('div');
community.classList.add('cardSet');
body.appendChild(community);
const playerCards = document.createElement('div');
playerCards.classList.add('cardSet');
body.appendChild(playerCards);
const offscreen = document.createElement('div');
body.appendChild(offscreen);
const cards = visibleCard_1.VisibleCard.pokerDeck(offscreen);
const deck = new deck_1.Deck(cards);
deck.shuffle();
deck.pop().moveTo(playerCards);
deck.pop().moveTo(playerCards);
deck.pop().moveTo(community);
deck.pop().moveTo(community);
deck.pop().moveTo(community);
deck.pop().moveTo(community);
deck.pop().moveTo(community);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 507:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Player = void 0;
class Player {
    constructor() {
        this.holeCards = new Array();
        this.name = Player.names[Player.nameIndex];
        ++Player.nameIndex;
        this.isFolded = false;
        this.betThisRound = 0;
        this.chips = 0;
    }
    static createNewPlayers(numberOfPlayers) {
        const players = [];
        for (let i = 0; i < numberOfPlayers; ++i) {
            players.push(new Player());
        }
        return players;
    }
}
exports.Player = Player;
Player.names = ['Abigail', 'Bob', 'Charlotte', 'Doogle', 'Eddie',
    'Francine', 'Gary', 'Herman', 'Izzie', 'Jack', 'Kili'];
Player.nameIndex = 0;
//# sourceMappingURL=player.js.map

/***/ }),

/***/ 884:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VisibleCard = void 0;
class VisibleCard {
    constructor(suit, rank, container) {
        this.div = document.createElement('div');
        this.suit = suit;
        this.rank = rank;
        this.pip = VisibleCard.getPip(rank);
        this.setFace();
        container.appendChild(this.div);
        this.div.style.visibility = 'hidden';
    }
    static pokerDeck(container) {
        const cards = [];
        for (const suit of VisibleCard.suits) {
            for (let rank = 2; rank <= 14; ++rank) {
                const card = new VisibleCard(suit, rank, container);
                cards.push(card);
            }
        }
        return cards;
    }
    static getPip(rank) {
        if (rank < 2 || rank > 14) {
            throw new Error(`Rank is out of range: ${rank}`);
        }
        let pip = rank.toFixed(0);
        if (rank === 14) {
            pip = 'A';
        }
        else if (rank === 10) {
            pip = 'T';
        }
        else if (rank === 11) {
            pip = 'J';
        }
        else if (rank === 12) {
            pip = 'Q';
        }
        else if (rank === 13) {
            pip = 'K';
        }
        return pip;
    }
    moveTo(conatiner) {
        // DOM automatically handles removing from previous parent.
        conatiner.appendChild(this.div);
        this.div.style.visibility = 'visible';
    }
    setFace() {
        this.div.classList.add('card');
        let pip = this.rank.toFixed(0);
        if (this.rank === 14) {
            pip = 'A';
        }
        else if (this.rank === 11) {
            pip = 'J';
        }
        else if (this.rank === 12) {
            pip = 'Q';
        }
        else if (this.rank === 13) {
            pip = 'K';
        }
        let suit = '';
        switch (this.suit) {
            case 'C':
                suit = '&#9827;';
                this.div.classList.add('black');
                break;
            case 'D':
                suit = '&#9830;';
                this.div.classList.add('red');
                break;
            case 'H':
                suit = '&#9829;';
                this.div.classList.add('red');
                break;
            case 'S':
                suit = '&#9824;';
                this.div.classList.add('black');
                break;
        }
        this.div.innerHTML = `${pip}${suit}`;
    }
}
exports.VisibleCard = VisibleCard;
VisibleCard.suits = ['C', 'D', 'H', 'S'];
//# sourceMappingURL=visibleCard.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__(138);
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=main.js.map