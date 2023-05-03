const fs = require("fs/promises");
const path = require("path");
const copied = path.join(__dirname, 'files-copy')
const dir =  path.join(__dirname, 'files');

const copyDir = async () => {
  try {
    await fs.mkdir(copied, {recursive: true});
    const data = await fs.readdir(dir, { withFileTypes: true });
    for await (const file of data) {
      fs.copyFile(path.join(dir, file.name), path.join(copied, file.name));
    }
  } catch (error) {
    console.log('error: ', error);
  }
};
copyDir();
