export type WhoSex = "boys" | "girls";
export type WhoMeasure = "weight" | "length" | "head" | "weightForLength";

export type WhoLmsRow = {
  x: number;
  l: number;
  m: number;
  s: number;
};

export type WhoCalculationResult = {
  x: number;
  value: number;
  zScore: number;
  percentile: number;
  l: number;
  m: number;
  s: number;
};