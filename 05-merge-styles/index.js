const { createReadStream, createWriteStream } = require("fs");
const fs = require("fs/promises");
const path = require("path");

const styleDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');

const main = async () => {
  const data = (await fs.readdir(styleDir, { withFileTypes: true })).filter(file => {
    return path.extname(file.name).replace(/\./, '') === 'css'
  });

  const writeableStream = createWriteStream(path.join(distDir, 'bundle.css'));

  for (const file of data) {
    const readableStream = createReadStream(path.join(styleDir, file.name), 'utf8');

    readableStream.on('data', (chank) => {
      writeableStream.write(chank);
    })
  }
}

main()