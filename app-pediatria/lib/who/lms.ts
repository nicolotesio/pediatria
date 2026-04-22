import type { WhoCalculationResult, WhoLmsRow } from "./types";

export function calculateZScore(value: number, l: number, m: number, s: number): number {
  if (value <= 0 || m <= 0 || s <= 0) {
    throw new Error("Value, M and S must be greater than 0.");
  }

  if (l === 0) {
    return Math.log(value / m) / s;
  }

  return (Math.pow(value / m, l) - 1) / (l * s);
}

export function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1 / (1 + p * absX);
  const y =
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) *
      t *
      Math.exp(-absX * absX));

  return sign * y;
}

export function zScoreToPercentile(z: number): number {
  return normalCdf(z) * 100;
}

export function getRowForMonth(rows: WhoLmsRow[], month: number): WhoLmsRow | undefined {
  return rows.find((row) => row.month === month);
}

export function calculateWhoPercentileFromRow(
  row: WhoLmsRow,
  value: number
): WhoCalculationResult {
  const zScore = calculateZScore(value, row.l, row.m, row.s);
  const percentile = zScoreToPercentile(zScore);

  return {
    month: row.month,
    value,
    zScore: round2(zScore),
    percentile: round1(percentile),
    l: row.l,
    m: row.m,
    s: row.s,
  };
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}