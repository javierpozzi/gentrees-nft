import sharp from "sharp";
import fs from "fs";

async function main() {
  const length = fs.readdirSync("./out/img").length;
  for (let i = 0; i < length; i++) {
    console.log(`Compressing image ${i} of ${length}...`);
    const imgPath = `out/img/${i}.jpg`;
    const buffer = await sharp(imgPath).jpeg({ quality: 80 }).toBuffer();
    sharp(buffer).toFile(imgPath);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
