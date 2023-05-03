const fs = require("fs/promises");
const path = require("path");
const dir = path.join(__dirname, "secret-folder");

const main = async () => {
  try {
    const data = await fs.readdir(dir, { withFileTypes: true });
    const res = data
      .filter((file) => !file.isDirectory())
      .map((file) => {
        const fileName = file.name;
        const fileExt = path.extname(file.name).replace(/\./, "");
        return {
          fileName,
          fileExt,
        };
      });
    const stats = await Promise.all(
      data.map((file) => fs.stat(path.join(dir, file.name)))
    );
    for (let i = 0; i < res.length; i++) {
      res[i].size = `${stats[i].size.toPrecision(3)}kb`;
    }

    console.table(res);
  } catch (error) {
    console.log(error);
  }
};

main();
