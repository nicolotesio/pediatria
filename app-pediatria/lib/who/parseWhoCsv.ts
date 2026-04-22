import { WhoLmsRow } from "./types";

export function parseWhoCsv(csvText: string): WhoLmsRow[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const dataLines = lines.slice(1);

  return dataLines.map((line) => {
    const cols = line.split(",");

    return {
      month: Number(cols[0]),
      l: Number(cols[1]),
      m: Number(cols[2]),
      s: Number(cols[3]),
    };
  });
}