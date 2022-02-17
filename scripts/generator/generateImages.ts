import * as dotenv from "dotenv";
import fs from "fs";
import { colors, Tree } from "./treeGeneratorCommons";
dotenv.config();

// If you want to make a 10k collection, consider using this batchSize
// to avoid generating 10k images in one go.
const batchSize = 1000;

const canvasSize = 1200;
const backgroundsMaxColorValue = 15;
const branchColorThreshold = 3;
const leafThreshold = 7;

async function main() {
  console.log(`Generating next ${batchSize} images...`);
  const length = fs.readdirSync("./out/meta").length;
  let imagesCreated = 0;
  for (let i = 0; i < length; i++) {
    const imgExists = fs.existsSync(`./out/img/${i}.jpg`);
    if (!imgExists) {
      console.log("Generating image", i, "of", length, "...");
      const tree = getTree(i);
      generateImg(tree);
      imagesCreated++;
    }
    if (imagesCreated === batchSize) {
      break;
    }
  }
}

function getTree(id: number): Tree {
  const metaJson = fs.readFileSync(`./out/meta/${id}`, "utf8");
  const meta = JSON.parse(metaJson);
  const tree: Tree = new Tree();
  tree.id = id;
  tree.rootColor = colors.find((c) => c.name === meta.attributes[0].value)!;
  tree.branchColor = colors.find((c) => c.name === meta.attributes[1].value)!;
  tree.leafColor = colors.find((c) => c.name === meta.attributes[2].value)!;
  tree.purity = meta.attributes[3].value;
  return tree;
}

function generateImg(tree: Tree) {
  // Required configuration to use p5.js on the server
  const Window = require("window");
  const { Blob } = require("./blob.js");
  global.window = new Window();
  global.window.Blob = Blob;
  global.document = global.window.document;
  global.screen = global.window.screen;
  global.navigator = global.window.navigator;
  const p5 = require("p5");

  const setup = function (p: any) {
    const canvas = p.createCanvas(canvasSize, canvasSize);
    p.background([
      p.random(backgroundsMaxColorValue),
      p.random(backgroundsMaxColorValue),
      p.random(backgroundsMaxColorValue),
    ]);
    p.noLoop();
    p.angleMode(p.DEGREES);
    p.translate(p.width / 2, p.height / 2);
    p.rotate(45 / 2);
    createTree(tree, p, 100, p.random(7, 10), 60);
    canvas.elt.toBlob(
      (data: { arrayBuffer: () => any }) => {
        fs.writeFileSync(`./out/img/${tree.id}.jpg`, data.arrayBuffer());
        p.remove();
      },
      "image/jpg",
      1
    );
  };
  // eslint-disable-next-line new-cap
  const p = new p5(setup);
  p.remove();
}

function createTree(
  tree: Tree,
  p: any,
  len: number,
  amount: number,
  angle: number
) {
  const increment = 360 / amount;
  let rotAmount;

  for (let i = 0; i < amount; i++) {
    p.push();
    rotAmount = -180 + increment * i;
    p.rotate(p.random(rotAmount - 60, rotAmount));
    createBranch(tree, p, len, angle, 1);
    p.pop();
  }
}

function createBranch(
  tree: Tree,
  p: any,
  len: number,
  angle: number,
  gen: number
) {
  let strokeColor;
  if (gen > branchColorThreshold && gen < leafThreshold) {
    strokeColor = tree.branchColor.rgb;
  } else if (gen > leafThreshold) {
    strokeColor = tree.leafColor.rgb;
  } else {
    strokeColor = tree.rootColor.rgb;
  }
  p.stroke(strokeColor);
  p.line(0, 0, 0, -len);
  p.translate(0, -len);
  len *= 0.7;
  angle = p.random(angle - 30, angle + 20);

  if (len > 1.5) {
    p.push();
    p.rotate(angle);
    createBranch(tree, p, len, angle, gen + 1);
    p.pop();

    p.push();
    p.rotate(-angle);
    createBranch(tree, p, len, angle, gen + 1);
    p.pop();
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
