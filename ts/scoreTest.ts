import { Score } from "./score";
import { Perf } from "./perf";

function constructorTest() {
    const startTime = Perf.now();
    var s: Score = new Score();
    console.log(`Elapsed ms: ${Perf.now() - startTime}`);
}

constructorTest();