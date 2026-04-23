import fs from "node:fs/promises";
import path from "node:path";
import { parseInesCsv } from "./parseInesCsv";
import type { InesLmsRow, InesMeasure } from "./types";

const FILE_MAP: Record<InesMeasure, string> = {
  peso: "INeS-Peso.csv",
  lunghezza: "INeS-Lunghezza.csv",
  cc: "INeS-CC.csv",
};

export async function loadInesCsv(measure: InesMeasure): Promise<InesLmsRow[]> {
  const fileName = FILE_MAP[measure];
  const filePath = path.join(process.cwd(), "data", "ines", fileName);

  const csvText = await fs.readFile(filePath, "utf-8");
  return parseInesCsv(csvText);
}
