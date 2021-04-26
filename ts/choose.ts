export class Choose<T> {
  private source: T[];
  private count: number;
  private position: number[] = [];
  private done: boolean = false;
  constructor(source: T[], count: number) {
    this.source = source;
    this.count = count;
    if (count > source.length) {
      throw new Error(`Cannot choose ${count} from ${source.length} elements`);
    }
    for (let i = 0; i < count; ++i) {
      this.position.push(i);
    }
  }

  private incrementAt(i: number) {
    if (i < 0) {
      this.done = true;
    }
    this.position[i] = this.position[i] + 1;
    if (this.position[i] > this.source.length - (this.count - i)) {
      this.incrementAt(i - 1);
    } else {
      for (let j = i + 1; j < this.count; ++j) {
        this.position[j] = this.position[j - 1] + 1;
      }
    }
  }

  private increment() {
    this.incrementAt(this.count - 1);
  }

  // Populates arr with the next permuation of `source` and increments 
  // the position.
  next(arr: T[]) {
    if (this.done) {
      throw new Error("Attenpted to iterate past end.");
    }
    let outIndex = 0;
    for (const i of this.position) {
      arr[outIndex++] = this.source[i];
    }
    this.increment();
  }

  /**
   * 
   * @param low Lowest in integer range (inclusuive)
   * @param high Highest in integer range (inclusive);
   */
  private randInclusive(low: number, high: number) {
    return Math.trunc(Math.random() * (high - low + 1)) + low;
  }

  rand(arr: T[]) {
    const position = [];
    for (let i = 0; i < this.count; ++i) {
      position.push(this.randInclusive(0, this.source.length - 1 - i));
    }
    for (let i = 1; i < this.count; ++i) {
      for (let j = 0; j < i; ++j) {
        if (position[j] <= position[i]) {
          position[i] = position[i] + 1;
        }
      }
    }
    position.sort();
    for (let i = 0; i < this.count; ++i) {
      arr[i] = this.source[position[i]];
    }
  }

  isDone(): boolean {
    return this.done;
  }

  size(): number {
    // https://en.wikipedia.org/wiki/Combination
    const n = this.source.length;
    const k = this.count;

    let numerator = 1;
    for (let i = n; i >= (n - k + 1); --i) {
      numerator *= i;
    }
    let denominator = 1;
    for (let i = k; i > 1; --i) {
      denominator *= i;
    }

    return numerator / denominator;
  }
}