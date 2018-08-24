const stream = require('stream')
const fs = require('fs')
const commands = ['--verbose'];
const configCommand = process.argv.slice(2)



class TextProcessor extends stream.Transform{
    constructor(configCommand){
        super({objectMode: true})

        this.textMeta = {
            timeElapsed: 0,
            lengthInBytes: 0,
            totalLines:0,
            configCommand:configCommand //remove 2nd?
        }
        this.startTime = new Date();

    }

    _transform(chunk, encoding, callback){
        if(chunk == null){ //if not chunk?
            console.log("Sorry, the file you are processing is empty")
        }else{
            this.textMeta.timeElapsed = new Date() - this.startTime;
            this.textMeta.lengthInBytes += Buffer.byteLength(chunk,encoding);
            this.textMeta.totalLines += countLines(chunk, encoding)

            // console.log(chunk, this.textMeta)
            console.log("Empty META", this.textMeta)
        }
        this.push(this.textMeta)
        console.log("FIlled META", this.textMeta)

        callback()

    }
    
}
    const countLines = (chunk, encoding) => {
        return chunk.toString(encoding).trim().split(/\n/).length
    }



class ObjectInfo extends stream.Transform{
    constructor(configCommand){
        super({writableObjectMode:true})
        if(configCommand){
           this.configCommand = configCommand
        }   
    }
    _transform(textMeta, encoding, callback){
        if(textMeta == null){
            console.log("Something went wrong!")
        }else{
            console.log(textMeta)
        }
    }
}


if(commands.includes(configCommand[0])){
    const textProcessor = new TextProcessor(configCommand);
    const objectInfo = new ObjectInfo(configCommand);

    process.stdin.pipe(textProcessor).pipe(objectInfo).pipe(process.stdout)
}else{
    console.log("Time to sleep!")
}

