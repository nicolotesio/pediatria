import fs from "node:fs/promises";
import path from "node:path";
import { parseIntergrowthCsv } from "./parseIntergrowthCsv";
import type { IntergrowthLmsRow, IntergrowthSex } from "./types";

const FILE_MAP: Record<IntergrowthSex, string> = {
  M: "intergrowth_boys_weight_with_LMS.csv",
  F: "intergrowth_girls_weight_with_LMS.csv",
};

export async function loadIntergrowthCsv(sex: IntergrowthSex): Promise<IntergrowthLmsRow[]> {
  const fileName = FILE_MAP[sex];
  const filePath = path.join(process.cwd(), "data", "intergrowth", fileName);

  const csvText = await fs.readFile(filePath, "utf-8");
  const rows = parseIntergrowthCsv(csvText);
  
  // Set sex for all rows
  return rows.map((row) => {
    return {
      ...row,
      sex,
    };
  });
}
