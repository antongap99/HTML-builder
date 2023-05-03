const { createReadStream, createWriteStream } = require("fs");
const fs = require("fs/promises");
const path = require("path");

const styleDir = path.join(__dirname, "styles");
const distDir = path.join(__dirname, "project-dist");
const assetsDir = path.join(__dirname, "assets");
const assetsDistDir = path.join(distDir, "assets");

const createStyleBandle = async () => {
  const styleFiles = (
    await fs.readdir(styleDir, { withFileTypes: true })
  ).filter((file) => {
    return path.extname(file.name).replace(/\./, "") === "css";
  });

  const writeableStream = createWriteStream(path.join(distDir, "style.css"));

  for (const file of styleFiles) {
    const readableStream = createReadStream(
      path.join(styleDir, file.name),
      "utf8"
    );

    readableStream.on("data", (chank) => {
      writeableStream.write(chank);
    });
  }
};

const copyDir = async (filePath, dist) => {
  const data = await fs.readdir(filePath, { withFileTypes: true });

  for await (const file of data) {
    if (file.isDirectory()) {
      const newDir = path.join(assetsDistDir, file.name);
      await fs.mkdir(newDir, { recursive: true });
      copyDir(path.join(filePath, file.name), newDir);
    } else {
      fs.copyFile(path.join(filePath, file.name), path.join(dist, file.name));
    }
  }
};

const copyAssets = async () => {
  try {
    await fs.mkdir(assetsDistDir, { recursive: true });
    copyDir(assetsDir, assetsDistDir);
  } catch (error) {
    console.log("error: ", error);
  }
};

const readComponent =  (temp) => {
  let result = "";
  const readableStream = createReadStream(
    path.join(__dirname, "components", `${temp}.html`),
    "utf8"
  );

  readableStream.on("data", (chunk) => {
    result += chunk;
  });

    return new Promise((res, rej) => {
      readableStream.on("end", () => {
        res(result)
      });

      readableStream.on("error", (err) => {
        rej(err)
      });
    })
};

const createHtml = async () => {
  const writeableStream = createWriteStream(path.join(distDir, "index.html"));
  const readableStream = createReadStream(
    path.join(__dirname, "template.html"),
    "utf8"
  );
  readableStream.on("data", async (chunk) => {
    const comps = chunk.match(/{{.+}}/gi);
    let template = chunk;

    for await (const temp of comps) {
      const res = await readComponent(
        temp.replace(/{|}/gi, "")
      );
      template = template.replace(new RegExp(`${temp}`, 'ig'), res);
    }

    writeableStream.write(template);
  });

  readableStream.on("error", (err) => {
    console.log(err);
  });
};

const main = async () => {
  await fs.mkdir(path.join(__dirname, "project-dist"), { recursive: true });
  // style
  await createStyleBandle();
  // assets
  await copyAssets();
  // html
  await createHtml();
};

main();
