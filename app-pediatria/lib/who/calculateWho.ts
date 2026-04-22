import { loadWhoCsv } from "./loadWhoCsv";
import {
  calculateWhoPercentileFromRow,
  getRowForMonth,
} from "./lms";
import type {
  WhoCalculationResult,
  WhoMeasure,
  WhoSex,
} from "./types";

export async function calculateWhoPercentile(params: {
  sex: WhoSex;
  measure: WhoMeasure;
  month: number;
  value: number;
}): Promise<WhoCalculationResult> {
  const { sex, measure, month, value } = params;

  const rows = await loadWhoCsv(sex, measure);
  const row = getRowForMonth(rows, month);

  if (!row) {
    throw new Error(`No WHO row found for month ${month}, sex ${sex}, measure ${measure}.`);
  }

  return calculateWhoPercentileFromRow(row, value);
}