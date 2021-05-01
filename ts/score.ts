import { Card } from "./card";
import { Deck } from "./deck";
import { Choose } from "./choose";
import { Perf } from "./perf";
import { StorageUtil } from "./storageUtil";
import { nextTick } from "node:process";

class ScoreNode {
  private children: ScoreNode[] = [];
  private score: number;
  constructor() { }

  // ranks must be sorted.
  insert(ranks: number[], index: number, score: number) {
    if (index === ranks.length) {
      this.score = score;
      return;
    }
    let next = this.children[ranks[index]];
    if (!next) {
      this.children[ranks[index]] = new ScoreNode();
      while (this.children.length < ranks[index]) {
        this.children.push(null);
      }
      next = this.children[ranks[index]];
    }
    next.insert(ranks, index + 1, score);
  }

  getScore(ranks: number[], index: number): number {
    if (this.children.length === 0) {
      return this.score;
    }
    const next = this.children[ranks[index]];
    if (!next) {
      return -1;
    }
    return next.getScore(ranks, index + 1);
  }
}


class ScoreTable {
  private flushTree: ScoreNode = new ScoreNode();
  private offSuitTree: ScoreNode = new ScoreNode();
  constructor() {
  }

  insert(hand: string, score: number) {
    var cards = "23456789TJQKA";
    const isFlush = hand.startsWith('+');
    const ranks: number[] = [];
    for (const c of hand) {
      if (c === '+') {
        continue;
      }
      const rank = cards.indexOf(c) + 2;
      ranks.push(rank);
    }
    ranks.sort();
    // console.log(`AAAAA: ranks: ${ranks}`);
    if (isFlush) {
      // console.log(`AAAAA: flush ${ranks} ${score}`);
      this.flushTree.insert(ranks, 0, score);
    } else {
      this.offSuitTree.insert(ranks, 0, score);
    }
  }

  score(hand: Card[]): number {
    const ranks: number[] = [];
    let isFlush = true;
    for (const c of hand) {
      if (c.suit != hand[0].suit) {
        isFlush = false;
      }
      ranks.push(c.rank);
    }
    ranks.sort();
    // console.log(`AAAAA: ${ranks}`);
    let score = -1;
    if (isFlush) {
      score = this.flushTree.getScore(ranks, 0);
    }
    if (score < 0) {
      score = this.offSuitTree.getScore(ranks, 0);
    }
    return score;
  }
}

export class Score {
  private scoreTable: ScoreTable = new ScoreTable();
  constructor() {
    this.GenerateScoreTable();
  }

  public scoreHand(hand: Array<Card>): number {
    let score = this.scoreTable.score(hand);
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

  // public generateHoleCardLookup() {
  //   let holeWinCount: Map<string, Array<number>> = new Map<string, Array<number>>();
  //   const cards = Deck.pokerDeckStubs();
  //   const deck = new Deck<Card>(cards);
  //   deck.shuffle();
  //   const c = new Choose<Card>(deck.getInDeck(), 9);
  //   const deal = new Array<Card>();
  //   const startTime = Perf.now();
  //   while (!c.isDone()) {
  //     if ((Perf.now() - startTime) > 60 * 1000) {
  //       break;
  //     }
  //     c.next(deal);
  //     let communityCards = []
  //     communityCards.push(deal.pop());
  //     communityCards.push(deal.pop());
  //     communityCards.push(deal.pop());
  //     communityCards.push(deal.pop());
  //     communityCards.push(deal.pop());
  //     let playerHand = [];
  //     playerHand.push(deal.pop());
  //     playerHand.push(deal.pop());
  //     let opponentHand = [];
  //     opponentHand.push(deal.pop());
  //     opponentHand.push(deal.pop());
  //     let playerScore = this.bestHand(playerHand.concat(communityCards));
  //     let opponentScore = this.bestHand(opponentHand.concat(communityCards));
  //     let handString = this.handToString(playerHand);
  //     let win = 0;
  //     if (playerScore == opponentScore) {
  //       continue;
  //     }
  //     if (playerScore > opponentScore) {
  //       win = 1;
  //     }
  //     if (holeWinCount.has(handString)) {
  //       let currentWins = holeWinCount.get(handString)[0];
  //       let currentCount = holeWinCount.get(handString)[1];
  //       holeWinCount.set(handString, [currentWins + win, currentCount + 1]);
  //     }
  //     else {
  //       holeWinCount.set(handString, [win, 1]);
  //     }
  //   }
  //   for (const [key, value] of holeWinCount) {
  //     this.holeTable.set(key, value[0] / value[1]);
  //   }
  //   let array = Array.from(this.holeTable, ([key, value]) => ({ key, value }));
  //   StorageUtil.saveObject('holeTable', array);
  // }

  public percentToWin(
      deck: Array<Card>, 
      playerHand: Array<Card>, 
      communityCards: Array<Card>, 
      numPlayers: number, 
      timeout: number = 10000, 
      numCommunityCards:number = 5, 
      numPlayerCards:number=2) 
    {
    let numberOfCardsFromDeck = (numCommunityCards - communityCards.length) + numPlayerCards * (numPlayers - 1);
    const c = new Choose<Card>(deck, numberOfCardsFromDeck);
    const deal = new Array<Card>();
    const hands = new Array<Array<Card>>();
    var wins = 0;
    var count = 0;
    const startTime = Perf.now();
    while (!c.isDone()) {
      c.next(deal);
      let tempCommunityCards = [...communityCards]
      while (tempCommunityCards.length < numCommunityCards) {
        tempCommunityCards.push(deal.pop());
      }
      let tempHand = playerHand.concat(tempCommunityCards);
      hands[0] = tempHand
      for (let i = 1; i < numPlayers; i++) {
        let tempHand = [...tempCommunityCards];
        for(let j=0; j<numPlayerCards; j++){
          tempHand.push(deal.pop());
        }
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
    const scoreMap: Map<string, number> = new Map<string, number>();

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
      if (scoreMap.has(sorted)) {
        console.log(`${sorted} is already in the list as ${scoreMap[sorted]}. Adding again as ${score}`);
      }
      scoreMap.set(sorted, score);
      score--;
    })

    for (const [hand, score] of scoreMap) {
      this.scoreTable.insert(hand, score);
    }
  }
}