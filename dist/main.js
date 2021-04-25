/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 298:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Card = void 0;
class Card {
    constructor(suit, rank, container) {
        this.div = document.createElement('div');
        this.suit = suit;
        this.rank = rank;
        this.setFace();
        container.appendChild(this.div);
    }
    setFace() {
        this.div.classList.add('card');
        let pip = this.rank.toFixed(0);
        if (this.rank === 1) {
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
exports.Card = Card;
Card.suits = ['C', 'D', 'H', 'S'];
//# sourceMappingURL=card.js.map

/***/ }),

/***/ 138:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
const card_1 = __webpack_require__(298);
const body = document.getElementsByTagName('body')[0];
for (const suit of card_1.Card.suits) {
    for (let rank = 1; rank <= 13; ++rank) {
        const card = new card_1.Card(suit, rank, body);
    }
}
//# sourceMappingURL=index.js.map

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