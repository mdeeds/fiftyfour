import * as tf from '@tensorflow/tfjs';
import { arraysEqual } from '@tensorflow/tfjs-core/dist/util_base';
import { GameState } from './gameState';
import { Score } from './score';
import { StorageUtil } from "./storageUtil";

const fs = require('fs');

export class Train {

  public model: tf.LayersModel;
  public inputs: Array<Array<number>> = new Array<Array<number>>();
  public outputs: Array<Array<number>> = new Array<Array<number>>();

  public loadTrainingData() {
    let s: Score = new Score();
    fs.readdir("./data/", (err, files) => {
      if (err) {
        throw err;
      }
      files.forEach(file => {
        let name: string = file.split('.')[0];
        let gameStates: Array<GameState> = new Array<GameState>();
        Object.assign(gameStates, StorageUtil.loadObject(name));
        for (let item of gameStates) {
          let chanceToWin = s.percentToWin(item.deck.inDeck, item.player.holeCards, item.communityCards, item.numPlayers);
          let chipsInPot = item.chipsInPot;
          let action = item.action;
          this.inputs.push([chipsInPot]);
          this.outputs.push([action]);
        }
      });
    });
  }

  public buildModel(inputSize: number, outputSize: number) {
    const input = tf.input({ shape: [inputSize] });
    const l1 = tf.layers.dense({ units: 5 }).apply(input);
    const l2 = tf.layers.dense({ units: 5 }).apply(l1);
    const o = tf.layers.dense({
      units: outputSize,
    }).apply(l2) as tf.SymbolicTensor;
    this.model = tf.model({ inputs: input, outputs: o });
  }
}