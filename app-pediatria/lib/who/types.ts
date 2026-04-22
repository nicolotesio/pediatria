export type WhoSex = "boys" | "girls";
export type WhoMeasure = "weight" | "length" | "head";

export type WhoLmsRow = {
  month: number;
  l: number;
  m: number;
  s: number;
};

export type WhoCalculationResult = {
  month: number;
  value: number;
  zScore: number;
  percentile: number;
  l: number;
  m: number;
  s: number;
};