import { loadInesCsv } from "./loadInesCsv";
import {
  calculateZScore,
  zScoreToPercentile,
} from "../who/lms";
import type {
  InesCalculationResult,
  InesMeasure,
  InesSex,
  InesPrimogenito,
  InesLmsRow,
} from "./types";

export async function calculateInesPercentile(params: {
  measure: InesMeasure;
  eg: number;
  sesso: InesSex;
  primogenito: InesPrimogenito;
  value: number;
}): Promise<InesCalculationResult> {
  const { measure, eg, sesso, primogenito, value } = params;

  const rows = await loadInesCsv(measure);

  const row = getRowForInes(rows, eg, sesso, primogenito);

  if (!row) {
    throw new Error(
      `No INES row found for EG=${eg}, sesso=${sesso}, primogenito=${primogenito}, measure=${measure}.`
    );
  }

  return calculateInesPercentileFromRow(row, value);
}

export function getRowForInes(
  rows: InesLmsRow[],
  eg: number,
  sesso: InesSex,
  primogenito: InesPrimogenito
): InesLmsRow | undefined {
  return rows.find(
    (row) => row.eg === eg && row.sesso === sesso && row.primogenito === primogenito
  );
}

export function calculateInesPercentileFromRow(
  row: InesLmsRow,
  value: number
): InesCalculationResult {
  const zScore = calculateZScore(value, row.l, row.m, row.s);
  const percentile = zScoreToPercentile(zScore);

  return {
    eg: row.eg,
    sesso: row.sesso,
    primogenito: row.primogenito,
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
