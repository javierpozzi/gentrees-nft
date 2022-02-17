import { task } from "hardhat/config";
import fs from "fs";

task("update-meta", "Update metadata with images IPFS CID.")
  .addParam("imagescid", "The IPFS CID of the image folder.")
  .setAction(async (taskArgs, _) => {
    const { imagescid } = taskArgs;

    console.log("Adding img url to metadata...");
    const length = fs.readdirSync("./out/meta").length;
    for (let i = 0; i < length; i++) {
      const metaJson = fs.readFileSync(`./out/meta/${i}`, "utf8");
      const meta = JSON.parse(metaJson);
      meta.image = `ipfs://${imagescid}/${i}.jpg`;
      fs.writeFileSync(`./out/meta/${i}`, JSON.stringify(meta));
    }
    console.log("Done!");
  });
