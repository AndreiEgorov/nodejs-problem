const stream = require("stream");
const fs = require("fs");
const commands = ["--save", "--run"];
const configCommand = process.argv.slice(2);

class TextProcessor extends stream.Transform {
  constructor(configCommand) {
    super({ objectMode: true });

    this.textMeta = {
      timeElapsed: 0,
      lengthInBytes: 0,
      totalLines: 0,
      chunkRead: "",
      configCommand //remove 2nd?
    };
    this.startTime = new Date();
  }

  _transform(chunk, encoding, callback) {
    if (chunk) {
      this.textMeta.timeElapsed = new Date() - this.startTime;
      this.textMeta.lengthInBytes += Buffer.byteLength(chunk, encoding);
      this.textMeta.totalLines += countLines(chunk, encoding);
      this.textMeta.chunkRead += chunk.toString(encoding);
      // console.log(chunk, this.textMeta)
      //   console.log("Empty META", this.textMeta);
    }
    this.push(this.textMeta);
    // console.log("FIlled META", this.textMeta);

    callback();
  }
}
const countLines = (chunk, encoding) => {
  return chunk
    .toString(encoding)
    .trim()
    .split(/\n/).length;
};

class ObjectInfo extends stream.Transform {
  constructor(configCommand) {
    super({ writableObjectMode: true });

    if (configCommand) {
      this.configCommand = configCommand;
    }
  }
  _transform(textMeta, encoding, callback) {
    const timeElapsed = textMeta.timeElapsed / 1000;
    const lengthInBytes = textMeta.lengthInBytes;
    const totalLines = textMeta.totalLines;
    const chunkRead = textMeta.chunkRead;

    const growthRate = lengthInBytes / timeElapsed;

    const report1 = chunkRead;
    const report = `Was read ${totalLines} lines. The text growth rate is ${growthRate} `;
    //   console.log(report);

    this.push(report + "\n");

    callback();
  }
}

const textProcessor = new TextProcessor(configCommand);
const objectInfo = new ObjectInfo(configCommand);

if (commands.includes(configCommand[0]) && configCommand[0] == "--save") {
  const myWriteStream = fs.createWriteStream(__dirname + "/newLog.txt");
  process.stdin.pipe(myWriteStream);
  console.log("A copy of processed data has been saved in newLog.txt");
} else if((configCommand[0] === undefined)){
    process.stdin
      .pipe(textProcessor)
      .pipe(objectInfo)
      .pipe(process.stdout);
  }else if(!commands.includes(configCommand[0])){
    console.log(`Command ${configCommand[0]} does not exist. You can only use command --save to save processed data in a newLog.txt file`)

}
