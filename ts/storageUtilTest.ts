import { DH_CHECK_P_NOT_PRIME } from "constants";
import { Card } from "./card";
import { Deck } from "./deck";
import { StorageUtil } from "./storageUtil";

async function saveLoad() {
  console.log('saveLoad');
  const content = `Hello ${Math.random()}\n`;
  await StorageUtil.save('test-file', content);
  const data = await StorageUtil.load('test-file');
  console.assert(data === content);
}

async function saveObject() {
  console.log('saveObject');
  const cards = Deck.pokerDeckStubs();
  const deck = new Deck<Card>(cards);
  await StorageUtil.saveObject('test-deck', deck);

  deck.shuffle();
  // When we load the deck, it should load the unshuffled deck,
  // and replace the shuffled one.
  Object.assign(deck, await StorageUtil.loadObject('test-deck'));

  const topCard = deck.pop();
  console.log(topCard);
  console.assert(topCard.pip === 'A', 1);
  console.assert(topCard.suit === 'S', 2);
}

async function go() {
  await saveLoad();
  await saveObject();
}

go();