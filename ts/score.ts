export class Score {

    private scoreTable: Map<string, number>;
    constructor() {
        const fs = require('fs')
        const readline = require('readline');
        const fileStream = fs.createReadStream('rankedHands.txt');
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        for (const line of rl) {
            var splitLine = line.split(",")
            this.scoreTable.set(splitLine[0], splitLine[1]);
        }
    }
}