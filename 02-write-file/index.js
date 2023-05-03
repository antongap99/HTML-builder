const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { stdin, stdout } = require("node:process");
const Exit = 'exit';

const file = path.resolve(__dirname, "text.txt");
const rl = readline.createInterface({ input: stdin, output: stdout });
const writeableStream = fs.createWriteStream(file);
rl.setPrompt('Привет, введите любой текст: ')



fs.open(file, "a+", (err, fd) => {
  if (err) return;
  rl.prompt()
  rl.setPrompt('')
});

rl.on("line", (input) => {
  if(input === Exit){
    console.log('До встречи');
    rl.close();
    return;
  }
  rl.prompt()
  writeableStream.write(input);
});

rl.on('SIGINT', () => {
  console.log('До встречи');
  rl.close();
});