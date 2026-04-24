import type { InesLmsRow } from "./types";

function parseNumber(value: string): number {
  return Number(value.replace(/,/g, "."));
}

export function parseInesCsv(csvText: string): InesLmsRow[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const dataLines = lines.slice(1); // Skip header

  return dataLines
    .map((line) => {
      const cleanedLine = line.replace(/^\uFEFF/, "");
      const cols = cleanedLine.split(";").map((value) => value.trim());

      if (cols.length < 6) return null;

      return {
        eg: parseNumber(cols[0]), // Età gestazionale
        sesso: cols[1] as "M" | "F", // Sesso
        primogenito: cols[2] as "SI" | "NO", // Primogenito
        l: parseNumber(cols[3]),
        m: parseNumber(cols[4]),
        s: parseNumber(cols[5]),
      };
    })
    .filter((row): row is InesLmsRow => row !== null && !Number.isNaN(row.eg));
}
