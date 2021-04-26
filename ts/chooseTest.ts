import { Choose } from "./choose";
import { Perf } from "./perf";

function chooseOne() {
  console.log('### chooseOne ###')
  const c = new Choose<number>([1, 2, 3], 1);
  console.assert(c.size() === 3, 1);
  const arr = [-1];
  c.next(arr);
  console.assert(arr[0] === 1, 2);
  c.next(arr);
  console.assert(arr[0] === 2, 3);
  c.next(arr);
  console.assert(arr[0] === 3, 4);
}

function chooseTwo() {
  console.log('### chooseTwo ###')
  const c = new Choose<number>([1, 2, 3], 2);
  console.assert(c.size() === 3, 1);
  const arr = [-1, -1];
  c.next(arr);
  console.log(`arr = ${arr}`);
  console.assert(arr[0] === 1, 2);
  console.assert(arr[1] === 2, 3);
  c.next(arr);
  console.log(`arr = ${arr}`);
  console.assert(arr[0] === 1, 4);
  console.assert(arr[1] === 3, 5);
  c.next(arr);
  console.log(`arr = ${arr}`);
  console.assert(arr[0] === 2, 6);
  console.assert(arr[1] === 3, 7);
}

function randThree() {
  console.log('### randThree ###')
  const c = new Choose<string>(['A', 'B', 'C', 'D', 'E'], 3);
  const arr = ['', ''];
  for (let i = 0; i < 10; ++i) {
    c.rand(arr);
    console.log(`Random: ${arr}`);
  }
}

function chooseThree() {
  console.log('### chooseThree ###');
  const source = [];
  for (let i = 0; i < 49; ++i) {
    source.push(i);
  }
  const c = new Choose(source, 3);
  let size = 1;
  const arr = [-1, -1, -1];
  c.next(arr);
  const startTime = Perf.now();
  console.assert(arr[0] === 0, 1);
  console.assert(arr[1] === 1, 2);
  console.assert(arr[2] === 2, 3);
  while (!c.isDone()) {
    c.next(arr);
    ++size;
  }
  console.log(`Elapsed ms: ${Perf.now() - startTime}`);
  console.log(`Last choice: ${arr}`);
  console.assert(arr[0] === 46, 4);
  console.assert(arr[1] === 47, 5);
  console.assert(arr[2] === 48, 6);
  console.assert(c.size() === size, `Actual: ${c.size()} != ${size}`);
}


chooseOne();
chooseTwo();
randThree();
chooseThree();