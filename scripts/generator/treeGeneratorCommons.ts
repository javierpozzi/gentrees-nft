export type TreePurity = "high" | "medium" | "low";

export interface Color {
  name: string;
  rgb: number[];
}

export class Tree {
  id!: number;
  rootColor!: Color;
  branchColor!: Color;
  leafColor!: Color;
  purity!: TreePurity;
}

export const colors: Color[] = [
  {
    name: "white",
    rgb: [255, 255, 255],
  },
  {
    name: "pink",
    rgb: [255, 192, 203],
  },
  {
    name: "red",
    rgb: [200, 0, 0],
  },
  {
    name: "green",
    rgb: [30, 200, 30],
  },
  {
    name: "blue",
    rgb: [50, 50, 220],
  },
  {
    name: "purple",
    rgb: [128, 0, 128],
  },
  {
    name: "yellow",
    rgb: [249, 215, 28],
  },
];
