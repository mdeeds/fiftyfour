import { StorageUtil } from "./storageUtil";

export class WasmChoose {
  private count: number;
  private outputPtr: number;
  private outputBuffer: ArrayBuffer;
  private choosePtr: number;
  private sourcePtr: number;
  private memory: WebAssembly.Memory;
  private chooseIsDone: Function;
  private chooseNext: Function;
  private speedTestFn: Function;

  private constructor() {
  }

  public static make(source: number[], count: number): Promise<WasmChoose> {
    return new Promise(async (resolve, reject) => {
      const result = new WasmChoose();
      result.count = count;
      await result.load(source, count);
      resolve(result);
    });
  }

  public next(arr: number[]) {
    this.chooseNext(this.choosePtr, this.outputPtr);
    for (let i = 0; i < this.count; ++i) {
      arr[i] = this.outputBuffer[i];
    }
  }

  public isDone(): boolean {
    return this.chooseIsDone(this.choosePtr);
  }

  public speedTest(source_count: number, choose_count: number): number {
    return this.speedTestFn(source_count, choose_count);
  }

  private load(source: number[], count: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const buf = await StorageUtil.loadArrayBuffer('fiftyfour.wasm');
      const module = await WebAssembly.compile(buf);
      const res = await WebAssembly.instantiate(buf, {
        wasi_snapshot_preview1: {
          proc_exit: function () { console.log("exit"); },
          args_sizes_get: function () { console.log("sizes"); },
          args_get: function () { console.log("get"); },
          fd_write: function () { console.log(arguments); },
        },
      });
      const {
        MakeChoose,
        ChooseIsDone,
        ChooseNext,
        Speed,
        memory,
        _malloc } = res.instance.exports;

      for (const [k, v] of Object.entries(res.instance.exports)) {
        console.log(`Export: ${k}`);
      }

      this.chooseIsDone = ChooseIsDone as Function;
      this.chooseNext = ChooseNext as Function;
      this.memory = memory as WebAssembly.Memory;
      console.log("Loaded.");
      this.outputPtr = (_malloc as Function)(count * 4);
      this.sourcePtr = (_malloc as Function)(source.length * 4);
      this.choosePtr = (MakeChoose as Function)(
        this.sourcePtr, source.length, count);
      this.speedTestFn = Speed as Function;

      const sourceMemory = new Int32Array(
        this.memory.buffer, this.sourcePtr, source.length);
      sourceMemory.set(source);
      this.outputBuffer = new Int32Array(
        this.memory.buffer, this.outputPtr, count);
      resolve();
    });
  }
}