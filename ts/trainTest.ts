import { Train } from "./train";
import { Perf } from "./perf";
import { appendFileSync } from "fs";

function loadTrainingDataTest() {
  var t = new Train();
  const startTime = Perf.now();
  t.loadTrainingData();
  console.log(`loadTrainingDataTest Elapsed ms: ${Perf.now() - startTime}`);
  console.assert(t.inputs.length > 0, `Actual: ${t.inputs.length}`);
  console.assert(t.outputs.length > 0, `Actual: ${t.outputs.length}`);
  console.assert(t.outputs.length == t.inputs.length);
}

function makeTrainingData(t: Train) {
  for (let i = 0; i < 10; i++) {
    t.inputs.push([1]);
    t.outputs.push([1]);
    t.inputs.push([2]);
    t.outputs.push([2]);
  }
}

function buildModelTest() {
  var t = new Train();
  makeTrainingData(t);
  const startTime = Perf.now();
  t.buildModel(t.inputs[0].length, t.outputs[0].length);
  t.model.summary();
  console.log(`buildModelTest Elapsed ms: ${Perf.now() - startTime}`);
}

async function trainModelTest() {
  var t = new Train();
  makeTrainingData(t);
  t.buildModel(t.inputs[0].length, t.outputs[0].length);
  const startTime = Perf.now();
  const hist = await t.trainModel();
  console.log(`trainModelTest Elapsed ms: ${Perf.now() - startTime}`);
  console.assert((hist.history['loss'][0] as number) > (hist.history['loss'][99] as number) * 99);
}

async function getActionTest() {
  var t = new Train();
  makeTrainingData(t);
  t.buildModel(t.inputs[0].length, t.outputs[0].length);
  const hist = await t.trainModel();
  const startTime = Perf.now();
  let Action1 = t.getAction([1])[0];
  let Action2 = t.getAction([2])[0];
  console.log(`getActionTest Elapsed ms: ${Perf.now() - startTime}`);
  console.assert(Action1 > 0.9 && Action1 < 1.1, `Expected 1 got ${Action1}`);
  console.assert(Action2 > 1.9 && Action1 < 2.1, `Expected 2 got ${Action2}`);
}

async function train4real() {
  const startTime = Perf.now();
  var t = new Train();
  t.loadTrainingData();
  t.buildModel(t.inputs[0].length, t.outputs[0].length);
  t.model.summary();
  const hist = await t.trainModel();
  for (let chipsInPot = 10; chipsInPot < 1000; chipsInPot += 10) {
    for (let toWin = 0; toWin < 1; toWin += 0.1) {
      let action = t.getAction([chipsInPot, toWin])[0];
      appendFileSync('function.csv', `${action},`);
    }
    appendFileSync('function.csv', "\n");
  }
}

async function go() {
  // loadTrainingDataTest();
  //buildModelTest();
  // await trainModelTest();
  // await getActionTest();
  await train4real();
}

go();
