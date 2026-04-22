import { WhoLmsRow } from "./types";

export function parseWhoCsv(csvText: string): WhoLmsRow[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const firstKey = headers[0];

  const dataLines = lines.slice(1);

  return dataLines.map((line) => {
    const cols = line.split(",");

    return {
      x: Number(cols[0]), // Month oppure Length
      l: Number(cols[1]),
      m: Number(cols[2]),
      s: Number(cols[3]),
    };
  });
}