import { loadIntergrowthCsv } from "./loadIntergrowthCsv";
import { calculateZScore, zScoreToPercentile } from "../who/lms";
import type { IntergrowthCalculationResult, IntergrowthLmsRow, IntergrowthSex } from "./types";

type CalculateIntergrowthOptions = {
  egWeeks: number;
  egDays: number;
  sex: IntergrowthSex;
  value: number; // peso in grammi
};

/**
 * Interpola i parametri LMS usando interpolazione lineare
 */
function getInterpolatedLMS(data: IntergrowthLmsRow[], egWeeks: number, egDays: number) {
  const egDecimal = egWeeks + egDays / 7;
  const sortedData = [...data].sort((a, b) => {
    const aDecimal = a.egWeeks + a.egDays / 7;
    const bDecimal = b.egWeeks + b.egDays / 7;
    return aDecimal - bDecimal;
  });

  // Se siamo prima del primo dato, trapiola con il primo punto
  const first = sortedData[0];
  const firstDecimal = first.egWeeks + first.egDays / 7;
  
  if (egDecimal < firstDecimal) {
    // Per INTERGROWTH, normalmente non andiamo sotto 22 settimane
    // Ma se succede, restituiamo il primo valore disponibile
    return {
      L: first.l,
      M: first.m,
      S: first.s,
    };
  }

  // Interpolazione lineare
  for (let i = 0; i < sortedData.length - 1; i++) {
    const p1 = sortedData[i];
    const p2 = sortedData[i + 1];
    
    const p1Decimal = p1.egWeeks + p1.egDays / 7;
    const p2Decimal = p2.egWeeks + p2.egDays / 7;

    if (egDecimal >= p1Decimal && egDecimal <= p2Decimal) {
      const t = (egDecimal - p1Decimal) / (p2Decimal - p1Decimal);
      const interpolate = (v1: number, v2: number) => v1 + t * (v2 - v1);

      return {
        L: interpolate(p1.l, p2.l),
        M: interpolate(p1.m, p2.m),
        S: interpolate(p1.s, p2.s),
      };
    }
  }

  // Se siamo oltre l'ultimo dato
  const last = sortedData[sortedData.length - 1];
  const previous = sortedData[sortedData.length - 2];
  
  const lastDecimal = last.egWeeks + last.egDays / 7;
  const previousDecimal = previous.egWeeks + previous.egDays / 7;
  
  const t = (egDecimal - previousDecimal) / (lastDecimal - previousDecimal);
  const interpolate = (v1: number, v2: number) => v1 + t * (v2 - v1);

  return {
    L: interpolate(previous.l, last.l),
    M: interpolate(previous.m, last.m),
    S: interpolate(previous.s, last.s),
  };
}

export async function calculateIntergrowth(
  options: CalculateIntergrowthOptions
): Promise<IntergrowthCalculationResult> {
  const { egWeeks, egDays, sex, value } = options;
  const egDecimal = egWeeks + egDays / 7;

  // Validazione EG (INTERGROWTH è disponibile da 22 settimane)
  if (egDecimal < 22.0 || egDecimal > 50.0) {
    throw new Error("Età gestazionale fuori range (22+0 - 50+0)");
  }

  // Validazione peso (value è in kg)
  if (value <= 0) {
    throw new Error("Il peso deve essere positivo");
  }

  if (value < 0.3 || value > 5.0) {
    throw new Error("Il peso deve essere plausibile (300-5000g)");
  }

  const data = await loadIntergrowthCsv(sex);

  if (data.length === 0) {
    throw new Error("Dati INTERGROWTH non disponibili per il sesso selezionato.");
  }

  const { L, M, S } = getInterpolatedLMS(data, egWeeks, egDays);

  // Valida che M e S siano positivi
  if (M <= 0 || S <= 0) {
    throw new Error("Parametri LMS non validi");
  }

  // Calcola Z-score usando la formula LMS
  const zScore = calculateZScore(value, L, M, S);
  
  // Converte Z-score in percentile
  const percentile = Math.min(100, Math.max(0, zScoreToPercentile(zScore)));

  return {
    egWeeks,
    egDays,
    egDecimal: parseFloat(egDecimal.toFixed(3)),
    sex,
    value,
    zScore: parseFloat(zScore.toFixed(2)),
    percentile: parseFloat(percentile.toFixed(1)),
    l: parseFloat(L.toFixed(6)),
    m: parseFloat(M.toFixed(6)),
    s: parseFloat(S.toFixed(6)),
  };
}
