import { InesData, InesResult } from "./types";

/**
 * Calcola i parametri LMS interpolati o estrapolati per un'età gestazionale esatta.
 * Gestisce nodi a metà settimana (23.5, 24.5, ...) e linearizzazione sotto 23.5.
 */
function getInterpolatedLMS(data: InesData[], eg: number) {
  // Ordina i dati per EG
  const sortedData = [...data].sort((a, b) => a.eg - b.eg);
  
  if (eg < sortedData[0].eg) {
    // Linearizzazione (Estrapolazione) per EG tra 23.0 e 23.5
    // Utilizza la pendenza tra i primi due nodi (23.5 e 24.5)
    const p1 = sortedData[0];
    const p2 = sortedData[1];
    const diffEg = p2.eg - p1.eg;

    const extrapolate = (val1: number, val2: number) => {
      const slope = (val2 - val1) / diffEg;
      return val1 + slope * (eg - p1.eg);
    };

    return {
      L: extrapolate(p1.L, p2.L),
      M: extrapolate(p1.M, p2.M),
      S: extrapolate(p1.S, p2.S),
    };
  }

  // Interpolazione lineare standard per EG >= 23.5
  for (let i = 0; i < sortedData.length - 1; i++) {
    const p1 = sortedData[i];
    const p2 = sortedData[i + 1];

    if (eg >= p1.eg && eg <= p2.eg) {
      const t = (eg - p1.eg) / (p2.eg - p1.eg);
      const interpolate = (v1: number, v2: number) => v1 + t * (v2 - v1);

      return {
        L: interpolate(p1.L, p2.L),
        M: interpolate(p1.M, p2.M),
        S: interpolate(p1.S, p2.S),
      };
    }
  }

  // Se fuori range superiore, restituisce l'ultimo punto
  const last = sortedData[sortedData.length - 1];
  return { L: last.L, M: last.M, S: last.S };
}

export function calculateInes(
  value: number,
  data: InesData[],
  egWeeks: number,
  egDays: number
): InesResult {
  const egDecimal = egWeeks + egDays / 7;

  // Range accettato: 23+0 (23.0) a 42+3 (42.428)
  if (egDecimal < 23.0 || egDecimal > 42.43) {
    throw new Error("Età gestazionale fuori range (23+0 - 42+3)");
  }

  const { L, M, S } = getInterpolatedLMS(data, egDecimal);

  // Formula LMS per Z-Score
  let z: number;
  if (Math.abs(L) < 0.01) {
    z = Math.log(value / M) / S;
  } else {
    z = (Math.pow(value / M, L) - 1) / (L * S);
  }

  // Calcolo Percentile usando la funzione di ripartizione normale
  const percentile = normalCDF(z) * 100;

  return {
    zScore: parseFloat(z.toFixed(2)),
    percentile: parseFloat(percentile.toFixed(1)),
    l: L,
    m: M,
    s: S,
  };
}

function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}