import { loadInesCsv } from "./loadInesCsv";
import type {
  InesCalculationResult,
  InesLmsRow,
  InesMeasure,
  InesPrimogenito,
  InesSex,
} from "./types";

type CalculateInesOptions = {
  measure: InesMeasure;
  egWeeks: number;
  egDays: number;
  sesso: InesSex;
  primogenito: InesPrimogenito;
  value: number;
};

/**
 * Calcola i parametri LMS interpolati o estrapolati per un'età gestazionale esatta.
 * Gestisce nodi a metà settimana (23.5, 24.5, ...) e linearizzazione sotto 23.5.
 */
function getInterpolatedLMS(data: InesLmsRow[], eg: number) {
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
      L: extrapolate(p1.l, p2.l),
      M: extrapolate(p1.m, p2.m),
      S: extrapolate(p1.s, p2.s),
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
        L: interpolate(p1.l, p2.l),
        M: interpolate(p1.m, p2.m),
        S: interpolate(p1.s, p2.s),
      };
    }
  }

  const last = sortedData[sortedData.length - 1];
  const previous = sortedData[sortedData.length - 2];
  const t = (eg - previous.eg) / (last.eg - previous.eg);
  const interpolate = (v1: number, v2: number) => v1 + t * (v2 - v1);

  return {
    L: interpolate(previous.l, last.l),
    M: interpolate(previous.m, last.m),
    S: interpolate(previous.s, last.s),
  };
}

export async function calculateInes(
  options: CalculateInesOptions
): Promise<InesCalculationResult> {
  const { measure, egWeeks, egDays, sesso, primogenito, value } = options;
  const egDecimal = egWeeks + egDays / 7;

  if (egDecimal < 23.0 || egDecimal > 42.42857142857143) {
    throw new Error("Età gestazionale fuori range (23+0 - 42+3)");
  }

  const data = await loadInesCsv(measure);
  const filteredData = data.filter(
    (row) => row.sesso === sesso && row.primogenito === primogenito
  );

  if (filteredData.length === 0) {
    throw new Error("Dati INeS non disponibili per il sesso o il primogenito selezionato.");
  }

  const { L, M, S } = getInterpolatedLMS(filteredData, egDecimal);

  let z: number;
  if (Math.abs(L) < 0.01) {
    z = Math.log(value / M) / S;
  } else {
    z = (Math.pow(value / M, L) - 1) / (L * S);
  }

  const percentile = Math.min(100, Math.max(0, normalCDF(z) * 100));

  return {
    eg: parseFloat(egDecimal.toFixed(3)),
    sesso,
    primogenito,
    value,
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