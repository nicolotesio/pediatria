import fs from "node:fs/promises";
import path from "node:path";
import { parseWhoCsv } from "./parseWhoCsv";
import type { WhoLmsRow, WhoMeasure, WhoSex } from "./types";

const FILE_MAP: Record<WhoSex, Record<WhoMeasure, string>> = {
  boys: {
    weight: "WHO-Boys-Weight-for-age-Percentiles.csv",
    length: "WHO-Boys-Length-for-age-Percentiles.csv",
    head: "WHO-Boys-Head-Circumference-for-age-Percentiles.csv",
  },
  girls: {
    weight: "WHO-Girls-Weight-for-age-Percentiles.csv",
    length: "WHO-Girls-Length-for-age-Percentiles.csv",
    head: "WHO-Girls-Head-Circumference-for-age-Percentiles.csv",
  },
};

export async function loadWhoCsv(
  sex: WhoSex,
  measure: WhoMeasure
): Promise<WhoLmsRow[]> {
  const fileName = FILE_MAP[sex][measure];
  const filePath = path.join(process.cwd(), "data", "who", fileName);

  const csvText = await fs.readFile(filePath, "utf-8");
  return parseWhoCsv(csvText);
}