import { loadWhoCsv } from "./loadWhoCsv";
import {
  calculateWhoPercentileFromRow,
  getClosestRowForX,
  getRowForX,
} from "./lms";
import type {
  WhoCalculationResult,
  WhoMeasure,
  WhoSex,
} from "./types";

export async function calculateWhoPercentile(params: {
  sex: WhoSex;
  measure: WhoMeasure;
  x: number;
  value: number;
}): Promise<WhoCalculationResult> {
  const { sex, measure, x, value } = params;

  const rows = await loadWhoCsv(sex, measure);

  const row =
    measure === "weightForLength"
      ? getClosestRowForX(rows, x)
      : getRowForX(rows, x);

  if (!row) {
    throw new Error(`No WHO row found for x=${x}, sex=${sex}, measure=${measure}.`);
  }

  return calculateWhoPercentileFromRow(row, value);
}

export function interpretPercentile(percentile: number): {
  label: string;
  tone: "red" | "amber" | "green" | "blue";
} {
  if (percentile < 3) {
    return { label: "Molto basso", tone: "red" };
  }
  if (percentile < 10) {
    return { label: "Basso", tone: "amber" };
  }
  if (percentile <= 90) {
    return { label: "Nella norma", tone: "green" };
  }
  if (percentile <= 97) {
    return { label: "Alto", tone: "blue" };
  }
  return { label: "Molto alto", tone: "blue" };
}