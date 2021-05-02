import * as tf from '@tensorflow/tfjs';
import { arraysEqual } from '@tensorflow/tfjs-core/dist/util_base';
import { GameState } from './gameState';
import { Score } from './score';
import { StorageUtil } from "./storageUtil";

const fs = require('fs');

export class TrainingPair {
  public gameState;
  public amountWon;
}

export class Train {

  public model: tf.LayersModel;
  public inputs: Array<Array<number>> = new Array<Array<number>>();
  public outputs: Array<Array<number>> = new Array<Array<number>>();

  public loadTrainingData() {
    let s: Score = new Score();
    let files = fs.readdirSync("./data/training/");
    for (let file of files) {
      let name: string = file.split('.')[0];
      let trainingPairs: Array<TrainingPair> = new Array<TrainingPair>();
      Object.assign(trainingPairs, StorageUtil.loadObject("training/" + name));
      for (let item of trainingPairs) {
        let chanceToWin = s.percentToWin(item.gameState.inDeck, item.gameState.playerHoleCards, item.gameState.communityCards, 2);
        let chipsInPot = item.gameState.chipsInPot;
        let currentBet = item.gameState.currentBet;
        let action = item.gameState.action;
        let amountWon = item.amountWon;

        this.inputs.push([chipsInPot, chanceToWin, action, currentBet]);
        this.outputs.push([amountWon]);
      }
    }
  }

  public buildModel(inputSize: number, outputSize: number) {
    const input = tf.input({ shape: [inputSize] });
    const l1 = tf.layers.dense({ units: 5, activation: 'relu' }).apply(input);
    const l2 = tf.layers.dense({ units: 5, activation: 'relu' }).apply(l1);
    const o = tf.layers.dense({
      units: outputSize,
    }).apply(l2) as tf.SymbolicTensor;
    this.model = tf.model({ inputs: input, outputs: o });

    let opt = tf.train.adam(0.1);

    this.model.compile({
      optimizer: opt, loss: tf.losses.meanSquaredError,
      metrics: ['accuracy']
    });
  }

  public trainModel(): Promise<tf.History> {
    let inputTensor = tf.tensor2d(this.inputs);
    let outputTensor = tf.tensor2d(this.outputs);

    return this.model.fit(inputTensor, outputTensor,
      {
        epochs: 100,
        shuffle: true,
        //verbose: 1,
        //batchSize: batchSize,
        //sampleWeight: weightTensor
      })
  }

  public getAction(inputs: Array<number>) {
    let inputTensor = tf.tensor([inputs]);
    let outputs: tf.Tensor = this.model.predict(inputTensor) as tf.Tensor;
    let action = outputs.dataSync();
    return action;
  }

  public async saveModel() {
    //await this.model.save("file://model.h5");
    await StorageUtil.saveObject("modelWeights", this.model.weights);
  }

  public async loadModel() {
    Object.assign(this.model.weights, StorageUtil.loadObject('modelWeights'));
    //this.model = await tf.loadLayersModel("file://model.h5");
  }
}