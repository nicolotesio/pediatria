export type WetflagResult = {
  weightKg: number;
  fluid10: number;
  fluid20: number;
  uncuffedTube?: number;
  cuffedTube?: number;
  adrenalineIM: number;
  adrenalineIV: number;
  defibrillation: number;
  glucose10: number;
};

export function estimateWeightFromAge(ageYears: number): number {
  return round1((ageYears + 4) * 2);
}

export function estimateTubeUncuffedFromAge(ageYears: number): number {
  return round1(ageYears / 4 + 4);
}

export function estimateTubeCuffedFromAge(ageYears: number): number {
  return round1(ageYears / 4 + 3.5);
}

export function calculateWetflag(
  weightKg: number,
  ageYears?: number
): WetflagResult {
  const safeWeight = Math.max(weightKg, 0);

  return {
    weightKg: round1(safeWeight),
    fluid10: round1(safeWeight * 10),
    fluid20: round1(safeWeight * 20),
    uncuffedTube:
      ageYears !== undefined
        ? estimateTubeUncuffedFromAge(ageYears)
        : undefined,
    cuffedTube:
      ageYears !== undefined
        ? estimateTubeCuffedFromAge(ageYears)
        : undefined,
    adrenalineIM: round1(safeWeight * 0.01), // mL of 1 mg/mL
    adrenalineIV: round1(safeWeight * 0.1), // mL of 0.1 mg/mL (1:10,000)
    defibrillation: round1(safeWeight * 4), // J
    glucose10: round1(safeWeight * 2), // mL
  };
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}