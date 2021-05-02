import { Choose } from "./choose";
import { Perf } from "./perf";
import { WasmChoose } from "./wasmChoose";

async function chooseSmall() {
  console.log('chooseSmall');
  const choose = await WasmChoose.make([1, 2, 3], 2);

  const out: number[] = [];
  const startTime = Perf.now();
  while (!choose.isDone()) {
    choose.next(out);
  }
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);
}

async function speedTest() {
  console.log('speedTest');
  const choose = await WasmChoose.make([1], 1);
  const startTime = Perf.now();
  console.log(`Iterations: ${choose.speedTest(52, 6)}`);
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);
}


function speedTestBaseline() {
  console.log('speedTestBaseline');
  const source: number[] = [];
  for (let i = 0; i < 52; ++i) {
    source.push(i);
  }
  const target: number[] = [];
  const choose = new Choose<number>(source, 6)
  const startTime = Perf.now();
  let i = 0;
  while (!choose.isDone()) {
    choose.next(target);
    ++i;
  }
  console.log(`Elapsed ms: ${Perf.now() - startTime}; ` +
    `Iterations: ${i}`);
}

async function speedTestPractical() {
  console.log('speedTestPractical');
  const source: number[] = [];
  for (let i = 0; i < 52; ++i) {
    source.push(i);
  }
  const target: number[] = [];
  const choose = await WasmChoose.make(source, 6);
  const startTime = Perf.now();
  let i = 0;
  while (!choose.isDone()) {
    choose.next(target);
    ++i;
  }
  console.log(`AAAAA: ${target}`);
  console.log(`Elapsed ms: ${Perf.now() - startTime}; ` +
    `Iterations: ${i}`);
}

async function go() {
  await chooseSmall();
  await speedTest();
  speedTestBaseline();
  await speedTestPractical();
}

go();