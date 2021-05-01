import { Train } from "./train";
import { Perf } from "./perf";

function loadTrainingDataTest() {
  var t = new Train();
  const startTime = Perf.now();
  t.loadTrainingData();
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);
  console.assert(t.inputs.length > 0, `Actual: ${t.inputs.length}`);
  console.assert(t.outputs.length > 0, `Actual: ${t.outputs.length}`);
}

function buildModelTest() {
  var t = new Train();
  t.loadTrainingData();
  const startTime = Perf.now();
  t.buildModel(t.inputs[0].length, t.outputs[0].length);
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);
}

loadTrainingDataTest();
buildModelTest();