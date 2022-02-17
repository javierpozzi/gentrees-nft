import * as dotenv from "dotenv";
import fs from "fs";
import { colors, Tree, TreePurity } from "./treeGeneratorCommons";
dotenv.config();

const collectionSize = Number(process.env.COLLECTION_SIZE);

async function main() {
  cleanFolders();
  const trees = generateTrees(collectionSize);
  generateMetas(trees);
}

function cleanFolders() {
  const { readdirSync, rmSync, existsSync, mkdirSync } = require("fs");

  if (!existsSync("./out")) {
    mkdirSync("./out");
  }

  if (!existsSync("./out/img")) {
    mkdirSync("./out/img");
  }

  if (!existsSync("./out/meta")) {
    mkdirSync("./out/meta");
  }

  readdirSync("./out/img").forEach((f: any) => rmSync(`./out/img/${f}`));
  readdirSync("./out/meta").forEach((f: any) => rmSync(`./out/meta/${f}`));
}

function generateTrees(quantity: number): Tree[] {
  const trees: Tree[] = [];
  for (let i = 0; i < quantity; i++) {
    console.log("Creating tree", i, "of", quantity);
    const tree = generateTree(i);
    trees.push(tree);
  }
  return trees;
}

function generateTree(id: number): Tree {
  const tree: Tree = new Tree();
  tree.id = id;
  tree.rootColor = colors[Math.floor(Math.random() * colors.length)];
  tree.branchColor = colors[Math.floor(Math.random() * colors.length)];
  tree.leafColor = colors[Math.floor(Math.random() * colors.length)];
  tree.purity = definePurity(tree);
  return tree;
}

function definePurity(tree: Tree): TreePurity {
  const purityValue = new Set([
    tree.rootColor.name,
    tree.branchColor.name,
    tree.leafColor.name,
  ]).size;

  let purity: TreePurity = "low";

  switch (purityValue) {
    case 1:
      purity = "high";
      break;
    case 2:
      purity = "medium";
      break;
    case 3:
      purity = "low";
      break;
  }

  return purity;
}

function generateMetas(trees: Tree[]) {
  console.log("Generating metadata...");
  for (const tree of trees) {
    generateMeta(tree);
  }
  console.log("Done!");
}

function generateMeta(tree: Tree) {
  const meta = {
    name: `#${tree.id}`,
    attributes: [
      {
        trait_type: "root",
        value: tree.rootColor.name,
      },
      {
        trait_type: "branch",
        value: tree.branchColor.name,
      },
      {
        trait_type: "leaf",
        value: tree.leafColor.name,
      },
      {
        trait_type: "purity",
        value: tree.purity,
      },
    ],
  };

  fs.writeFileSync(`./out/meta/${tree.id}`, JSON.stringify(meta));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
