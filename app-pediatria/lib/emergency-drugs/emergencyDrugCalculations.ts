/**
 * Funzioni di calcolo per dosaggi pediatrici di emergenza
 * Gestisce il calcolo delle dosi in base al peso, con applicazione dei massimali
 */

export type CalculationResult = {
  dose: number;
  capped: boolean; // true se è stato applicato il massimale
  cappedAt?: number; // valore del massimale applicato
  formula: string; // descrizione della formula usata
};

/**
 * Arrotonda a un decimale per mL e simili
 */
export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Arrotonda a due decimali per mg e simili
 */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Arrotonda a numero intero per microgrammi, Joule, etc.
 */
export function roundInt(value: number): number {
  return Math.round(value);
}

/**
 * Arrotonda a un decimale per unità di insulina
 */
export function roundInsulin(value: number): number {
  return Math.round(value * 10) / 10;
}

type RoundingFunction = (value: number) => number;

const roundingMap: Record<string, RoundingFunction> = {
  "mL": round1,
  "mg": round2,
  "microgrammi": roundInt,
  "J": roundInt,
  "unità": roundInsulin,
  "mmol": round2,
};

function getRoundingFunction(unit: string): RoundingFunction {
  return roundingMap[unit] || round1;
}

/**
 * Calcola la dose per kg e applica il massimale
 */
export function calculateDosePerKg(
  weightKg: number,
  dosePerKg: number,
  maxDose: number | undefined,
  unit: string
): CalculationResult {
  const round = getRoundingFunction(unit);
  const calculatedDose = round(weightKg * dosePerKg);
  
  if (maxDose !== undefined && calculatedDose > maxDose) {
    return {
      dose: round(maxDose),
      capped: true,
      cappedAt: maxDose,
      formula: `${dosePerKg} ${unit}/kg × ${weightKg} kg = ${calculatedDose} ${unit} → limitato a ${maxDose} ${unit}`,
    };
  }

  return {
    dose: calculatedDose,
    capped: false,
    formula: `${dosePerKg} ${unit}/kg × ${weightKg} kg = ${calculatedDose} ${unit}`,
  };
}

/**
 * Calcola una dose fissa (indipendente dal peso)
 */
export function calculateFixedDose(
  doseFixed: number,
  unit: string
): CalculationResult {
  const round = getRoundingFunction(unit);
  const dose = round(doseFixed);

  return {
    dose,
    capped: false,
    formula: `Dose fissa: ${dose} ${unit}`,
  };
}

/**
 * Calcola una dose con range (es. Adenosina 0.1-0.2 mg/kg)
 * Ritorna il valore minimo e massimo del range
 */
export function calculateDoseRange(
  weightKg: number,
  minDosePerKg: number,
  maxDosePerKg: number,
  absoluteMax: number | undefined,
  unit: string
): {
  min: number;
  max: number;
  cappedAt?: number;
  formula: string;
} {
  const round = getRoundingFunction(unit);
  
  let minDose = round(weightKg * minDosePerKg);
  let maxDose = round(weightKg * maxDosePerKg);

  let cappedAt: number | undefined;

  if (absoluteMax !== undefined) {
    if (maxDose > absoluteMax) {
      cappedAt = absoluteMax;
      maxDose = round(absoluteMax);
    }
  }

  return {
    min: minDose,
    max: maxDose,
    cappedAt,
    formula: `${minDosePerKg}–${maxDosePerKg} ${unit}/kg × ${weightKg} kg = ${minDose}–${maxDose} ${unit}${
      cappedAt ? ` → limitato a ${cappedAt} ${unit}` : ""
    }`,
  };
}

/**
 * Verifica se il peso rientra nei limiti di sicurezza
 */
export function getWeightAlertStatus(
  weightKg: number,
  ageYears: number | undefined
): {
  level: "red" | "yellow" | "none";
  message?: string;
} {
  // Alert rosso: peso < 10 kg oppure età < 1 anno
  if (weightKg < 10 || (ageYears !== undefined && ageYears < 1)) {
    return {
      level: "red",
      message: "Età inferiore a 1 anno o peso inferiore a 10 kg — considerare linee guida neonatali ALS o fare riferimento a RCUK.",
    };
  }

  // Alert giallo: peso > 70 kg
  if (weightKg > 70) {
    return {
      level: "yellow",
      message: "Calcoli consentiti fino a 70 kg. Nei bambini con peso corporeo elevato, considerare il dosaggio sul peso ideale per i farmaci idrofili.",
    };
  }

  return {
    level: "none",
  };
}

/**
 * Applica il limite di peso massimo per i calcoli (70 kg)
 */
export function getEffectiveWeight(weightKg: number): {
  effective: number;
  capped: boolean;
} {
  if (weightKg > 70) {
    return {
      effective: 70,
      capped: true,
    };
  }
  return {
    effective: weightKg,
    capped: false,
  };
}

/**
 * Formatta il valore di dosaggio con il suo unit per la visualizzazione
 */
export function formatDose(dose: number, unit: string, capped?: boolean): string {
  const round = getRoundingFunction(unit);
  const formatted = round(dose);
  const cappedLabel = capped ? " (limitato)" : "";
  return `${formatted} ${unit}${cappedLabel}`;
}
