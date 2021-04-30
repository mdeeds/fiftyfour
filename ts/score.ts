import { Card } from "./card";
import { Deck } from "./deck";
import { Choose } from "./choose";
import { Perf } from "./perf";

export class Score {
  public scoreTable: Map<string, number> = new Map<string, number>();
  constructor() {
    this.GenerateScoreTable();
  }
  private handToString(hand: Array<Card>): string {
    let handString = "";
    let suit = hand[0].suit;
    let suited: boolean = true;
    hand.forEach(card => {
      if (card.suit != suit) {
        suited = false;
      }
      handString += card.pip;
    })
    if (suited) {
      handString += '+';
    }
    const sorted = handString.split('').sort().join(''); // I think this takes a long time.
    return sorted;
  }

  public scoreHand(hand: Array<Card>): number {
    let sorted = this.handToString(hand);
    let score = this.scoreTable.get(sorted);
    return score;
  }

  public bestHand(cards: Array<Card>): number {
    let bestScore = 0;
    const c = new Choose<Card>(cards, 5);
    const hand = new Array<Card>();
    var count = 0;
    while (!c.isDone()) {
      c.next(hand);
      bestScore = Math.max(this.scoreHand(hand), bestScore);
    }
    return bestScore;
  }

  public percentToWin(deck: Deck<Card>, playerHand: Array<Card>, communityCards: Array<Card>, numPlayers: number, timeout: number = 10000) {
    let numberOfCardsFromDeck = (5 - communityCards.length) + 2 * (numPlayers - 1);
    const c = new Choose<Card>(deck.getInDeck(), numberOfCardsFromDeck);
    const deal = new Array<Card>();
    const hands = new Array<Array<Card>>();
    var wins = 0;
    var count = 0;
    const startTime = Perf.now();
    while (!c.isDone()) {
      c.next(deal);
      let tempCommunityCards = [...communityCards]
      while (tempCommunityCards.length < 5) {
        tempCommunityCards.push(deal.pop());
      }
      let tempHand = playerHand.concat(tempCommunityCards);
      hands[0] = tempHand
      for (let i = 1; i < numPlayers; i++) {
        let tempHand = [...tempCommunityCards];
        tempHand.push(deal.pop());
        tempHand.push(deal.pop());
        hands[i] = tempHand;
      }
      let bestScores: Array<number> = new Array<number>();
      hands.forEach(h => {

        bestScores.push(this.bestHand(h));
      });
      if (bestScores[0] == Math.max(...bestScores)) {
        wins++;
      }
      count++;
      if ((Perf.now() - startTime) > timeout) {
        break;
      }
    }
    return wins / count;
  }

  private GenerateScoreTable() {
    var cards = "23456789TJQKA";

    let ranked: Set<string> = new Set<string>();
    // Straight flushes
    ranked.add("AKQJT+");
    ranked.add("KQJT9+");
    ranked.add("QJT98+");
    ranked.add("JT987+");
    ranked.add("T9876+");
    ranked.add("98765+");
    ranked.add("87654+");
    ranked.add("76543+");
    ranked.add("65432+");
    // four of a kind
    for (let j = cards.length - 1; j >= 0; j--) {
      for (let i = cards.length - 1; i >= 0; i--) {
        if (i != j) {
          var quad = cards.substring(j, j + 1);
          var kicker = cards.substring(i, i + 1);

          var hand = quad + quad + quad + quad + kicker;
          ranked.add(hand);
        }
      }
    }
    // full house
    for (let j = cards.length - 1; j >= 0; j--) {
      for (let i = cards.length - 1; i >= 0; i--) {
        if (i != j) {
          let trip = cards.substring(j, j + 1);
          let over = cards.substring(i, i + 1);

          let hand = trip + trip + trip + over + over;
          ranked.add(hand);
        }
      }
    }
    // flush
    for (let c1 = cards.length - 1; c1 >= 0; c1--) {
      let card1 = cards.substring(c1, c1 + 1);
      for (let c2 = c1 - 1; c2 >= 0; c2--) {
        let card2 = cards.substring(c2, c2 + 1);
        for (let c3 = c2 - 1; c3 >= 0; c3--) {
          let card3 = cards.substring(c3, c3 + 1);
          for (let c4 = c3 - 1; c4 >= 0; c4--) {
            let card4 = cards.substring(c4, c4 + 1);
            for (let c5 = c4 - 1; c5 >= 0; c5--) {
              let card5 = cards.substring(c5, c5 + 1);
              let flush = card1 + card2 + card3 + card4 + card5 + "+";
              if (!ranked.has(flush)) {
                ranked.add(flush);
              }
            }
          }
        }
      }
    }
    //// Straights
    ranked.add("AKQJT");
    ranked.add("KQJT9");
    ranked.add("QJT98");
    ranked.add("JT987");
    ranked.add("T9876");
    ranked.add("98765");
    ranked.add("87654");
    ranked.add("76543");
    ranked.add("65432");
    // Three of a kind
    for (let t = cards.length - 1; t >= 0; t--) {
      for (let k1 = cards.length - 1; k1 >= 0; k1--) {
        for (let k2 = k1 - 1; k2 >= 0; k2--) {
          if (t != k1 && t != k2 && k1 != k2) {
            let trip = cards.substring(t, t + 1);
            let kicker1 = cards.substring(k1, k1 + 1);
            let kicker2 = cards.substring(k2, k2 + 1);
            let hand = trip + trip + trip + kicker1 + kicker2;
            ranked.add(hand);
          }
        }
      }
    }
    // Two Pair
    for (let p1 = cards.length - 1; p1 >= 0; p1--) {
      for (let p2 = p1 - 1; p2 >= 0; p2--) {
        for (let k = cards.length - 1; k >= 0; k--) {
          if (p1 != k && p2 != k) {
            let pair1 = cards.substring(p1, p1 + 1);
            let pair2 = cards.substring(p2, p2 + 1);
            let kicker = cards.substring(k, k + 1);
            hand = pair1 + pair1 + pair2 + pair2 + kicker;
            ranked.add(hand);
          }
        }
      }
    }
    // One Pair
    for (let p = cards.length - 1; p >= 0; p--) {
      for (let k1 = cards.length - 1; k1 >= 0; k1--) {
        for (let k2 = k1 - 1; k2 >= 0; k2--) {
          for (let k3 = k2 - 1; k3 >= 0; k3--) {
            if (p != k1 && p != k2 && p != k3) {
              let pair = cards.substring(p, p + 1);
              let kicker1 = cards.substring(k1, k1 + 1);
              let kicker2 = cards.substring(k2, k2 + 1);
              let kicker3 = cards.substring(k3, k3 + 1);

              let hand = pair + pair + kicker1 + kicker2 + kicker3;
              ranked.add(hand);
            }
          }
        }
      }
    }
    // High Card
    for (let c1 = cards.length - 1; c1 >= 0; c1--) {
      let card1 = cards.substring(c1, c1 + 1);
      for (let c2 = c1 - 1; c2 >= 0; c2--) {
        let card2 = cards.substring(c2, c2 + 1);
        for (let c3 = c2 - 1; c3 >= 0; c3--) {
          let card3 = cards.substring(c3, c3 + 1);
          for (let c4 = c3 - 1; c4 >= 0; c4--) {
            let card4 = cards.substring(c4, c4 + 1);
            for (let c5 = c4 - 1; c5 >= 0; c5--) {
              let card5 = cards.substring(c5, c5 + 1);
              let high = card1 + card2 + card3 + card4 + card5;
              if (!ranked.has(high)) {
                ranked.add(high);
              }
            }
          }
        }
      }
    }
    let score: number = ranked.size;
    ranked.forEach(s => {
      const sorted = s.split('').sort().join('')
      if (this.scoreTable.has(sorted)) {
        console.log(`${sorted} is already in the list as ${this.scoreTable[sorted]}. Adding again as ${score}`);
      }
      this.scoreTable.set(sorted, score);
      score--;
    })
    let stop = 1;
  }
}