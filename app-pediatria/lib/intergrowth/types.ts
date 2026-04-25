export type IntergrowthSex = "M" | "F";
export type IntergrowthMeasure = "weight";

export type IntergrowthData = IntergrowthLmsRow;
export type IntergrowthResult = IntergrowthCalculationResult;

export type IntergrowthLmsRow = {
  egWeeks: number;
  egDays: number;
  sex: IntergrowthSex;
  l: number;
  m: number;
  s: number;
};

export type IntergrowthCalculationResult = {
  egWeeks: number;
  egDays: number;
  egDecimal: number;
  sex: IntergrowthSex;
  value: number;
  zScore: number;
  percentile: number;
  l: number;
  m: number;
  s: number;
};
