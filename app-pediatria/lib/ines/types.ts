export type InesSex = "M" | "F";
export type InesPrimogenito = "SI" | "NO";
export type InesMeasure = "peso" | "lunghezza" | "cc";

export type InesLmsRow = {
  eg: number; // Età gestazionale (settimane)
  sesso: InesSex;
  primogenito: InesPrimogenito;
  l: number;
  m: number;
  s: number;
};

export type InesCalculationResult = {
  eg: number;
  sesso: InesSex;
  primogenito: InesPrimogenito;
  value: number;
  zScore: number;
  percentile: number;
  l: number;
  m: number;
  s: number;
  displayValue?: string;
};
