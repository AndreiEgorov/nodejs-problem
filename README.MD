# Solution

To solve the problem, two streamsn were created. One would accept a block of line-separated text and return an object that contains elapsed time, length of the text block in bytes, and total length of the text block. It would then pass this objet (TextMeta) onto the second stream. THe second stream would use the data genearat one-line report about the processed text. The report outputs the number of lines read through put rate.

The sample text for processing is stored in myText.txt file in the same directory as index.js.

# Process text

To process the sample text and generate report run `tail -f myText.txt | node index.js`.

The processsed text can also be stored in a newLog.txt file which will be created after `tail -f myText.txt | node index.js --save` command is run.

If a config command other than `--save` is run, a prompt will appear to use a `--save` command.

# Author

Andrei Egorov

# Problem

- Try to avoid using third-party modules
- Stick to node.js core APIs
- Write a test to confirm your module works correctly
  Create a duplex stream that consume line-separated text and outputs objects with keys for the elapsed time, total length in bytes, and total lines.

Create a stream that takes these objects and outputs one-line summary reports (human readable). The report should include the throughput rate of the input stream in bytes/sec.

Use your new streams in a script that reads stdin (such as tailing a log file) and report on the number of lines and growth rate of the file. Bonus points if your script is configurable in some way via argv (use your imagination).

Imagine a usage like this:

`$ tail -f mylogfile | myscript --verbose`
