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

export function getPercentileTone(
  percentile: number,
  measure: "weight" | "length" | "head" | "weightForLength"
): "red" | "amber" | "green" | "blue" {
  if (measure === "weightForLength") {
    if (percentile < 3) return "red";
    if (percentile < 10) return "amber";
    if (percentile <= 90) return "green";
    if (percentile <= 97) return "blue";
    return "blue";
  }

  if (measure === "weight") {
    if (percentile < 3) return "red";
    if (percentile < 10) return "amber";
    if (percentile <= 90) return "green";
    return "blue";
  }

  if (measure === "length") {
    if (percentile < 3) return "red";
    if (percentile <= 97) return "green";
    return "blue";
  }

  if (measure === "head") {
    if (percentile < 3) return "red";
    if (percentile <= 97) return "green";
    return "blue";
  }

  return "green";
}