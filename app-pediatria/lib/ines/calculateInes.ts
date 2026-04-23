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
  egWeeks: number;
  egDays: number;
  egFraction?: number;
  sesso: InesSex;
  primogenito: InesPrimogenito;
  value: number;
}): Promise<InesCalculationResult> {
  const { measure, egWeeks, egDays, egFraction, sesso, primogenito, value } = params;

  const rows = await loadInesCsv(measure);

  // Se non c'è frazione (cioè egDays = 0), usa direttamente la riga per egWeeks
  if (egDays === 0) {
    const row = getRowForInes(rows, egWeeks, sesso, primogenito);
    if (!row) {
      throw new Error(
        `No INES row found for EG=${egWeeks}, sesso=${sesso}, primogenito=${primogenito}, measure=${measure}.`
      );
    }
    return calculateInesPercentileFromRow(row, value, egWeeks);
  }

  // Altrimenti, interpola tra egWeeks e egWeeks+1
  const row1 = getRowForInes(rows, egWeeks, sesso, primogenito);
  const row2 = getRowForInes(rows, egWeeks + 1, sesso, primogenito);

  if (!row1 || !row2) {
    throw new Error(
      `No INES rows found for interpolation at EG=${egWeeks}-${egWeeks + 1}, sesso=${sesso}, primogenito=${primogenito}, measure=${measure}.`
    );
  }

  // Interpola i parametri LMS tra i due punti
  const interpolatedRow = interpolateLmsRows(row1, row2, egDays / 7);
  return calculateInesPercentileFromRow(interpolatedRow, value, egFraction || egWeeks);
}

function interpolateLmsRows(
  row1: InesLmsRow,
  row2: InesLmsRow,
  fraction: number
): InesLmsRow {
  // Interpola linearmente i parametri L, M, S
  return {
    eg: Math.round((row1.eg + (row2.eg - row1.eg) * fraction) * 1000) / 1000,
    sesso: row1.sesso,
    primogenito: row1.primogenito,
    l: row1.l + (row2.l - row1.l) * fraction,
    m: row1.m + (row2.m - row1.m) * fraction,
    s: row1.s + (row2.s - row1.s) * fraction,
  };
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
  value: number,
  displayEg?: number
): InesCalculationResult {
  const zScore = calculateZScore(value, row.l, row.m, row.s);
  const percentile = zScoreToPercentile(zScore);

  return {
    eg: displayEg || row.eg,
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
