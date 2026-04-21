export type WetflagResult = {
  weightKg: number;
  fluid10: number;
  fluid20: number;
  uncuffedTube?: number;
  cuffedTube?: number;
};

export function estimateWeightFromAge(ageYears: number): number {
  return ageYears * 2 + 8;
}

export function estimateTubeUncuffedFromAge(ageYears: number): number {
  return ageYears / 4 + 4;
}

export function estimateTubeCuffedFromAge(ageYears: number): number {
  return ageYears / 4 + 3.5;
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
      ageYears !== undefined ? round1(estimateTubeUncuffedFromAge(ageYears)) : undefined,
    cuffedTube:
      ageYears !== undefined ? round1(estimateTubeCuffedFromAge(ageYears)) : undefined,
  };
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}