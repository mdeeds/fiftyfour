export class Perf {
  static now = typeof (performance) === 'undefined' ?
    () => {
      const hr = process.hrtime();
      return hr[1] / 1000000 + hr[0] * 1000;
    } :
    () => { return performance.now() };
}