import type { IntergrowthLmsRow } from "./types";

/**
 * Parser per CSV INTERGROWTH-21
 * Formato: gestational_age_weeks,gestational_age_days,...,L,M,S,...
 */
export function parseIntergrowthCsv(csvText: string): IntergrowthLmsRow[] {
  const lines = csvText.trim().split("\n");
  
  if (lines.length < 2) {
    throw new Error("CSV file is empty or invalid");
  }

  // Parse header
  const header = lines[0].split(",").map((h) => h.trim());
  const weekIndex = header.indexOf("gestational_age_weeks");
  const dayIndex = header.indexOf("gestational_age_days");
  const lIndex = header.indexOf("L");
  const mIndex = header.indexOf("M");
  const sIndex = header.indexOf("S");

  if (weekIndex === -1 || dayIndex === -1 || lIndex === -1 || mIndex === -1 || sIndex === -1) {
    throw new Error("CSV header is missing required columns");
  }

  const rows: IntergrowthLmsRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(",").map((col) => col.trim());

    const egWeeks = parseInt(cols[weekIndex], 10);
    const egDays = parseInt(cols[dayIndex], 10);
    const l = parseFloat(cols[lIndex]);
    const m = parseFloat(cols[mIndex]);
    const s = parseFloat(cols[sIndex]);

    if (isNaN(egWeeks) || isNaN(egDays) || isNaN(l) || isNaN(m) || isNaN(s)) {
      console.warn(`Skipping invalid row ${i}:`, line);
      continue;
    }

    rows.push({
      egWeeks,
      egDays,
      sex: "M", // Will be set by loader based on file
      l,
      m,
      s,
    });
  }

  return rows;
}
