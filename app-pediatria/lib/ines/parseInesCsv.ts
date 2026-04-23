import type { InesLmsRow } from "./types";

export function parseInesCsv(csvText: string): InesLmsRow[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const dataLines = lines.slice(1); // Skip header

  return dataLines.map((line) => {
    const cols = line.split(",");

    return {
      eg: Number(cols[0]), // Età gestazionale
      sesso: cols[1] as "M" | "F", // Sesso
      primogenito: cols[2] as "SI" | "NO", // Primogenito
      l: Number(cols[3]),
      m: Number(cols[4]),
      s: Number(cols[5]),
    };
  });
}
