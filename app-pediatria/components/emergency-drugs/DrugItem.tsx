"use client";

import {
  CalculationResult,
  calculateDosePerKg,
  calculateFixedDose,
  calculateDoseRange,
} from "@/lib/emergency-drugs/emergencyDrugCalculations";

interface DrugDosage {
  label: string;
  dosePerKg?: number;
  dosePerKgMin?: number;
  dosePerKgMax?: number;
  doseFixed?: number;
  maxDose?: number;
  unit: string;
  description: string;
  calculation?: string;
  notes?: string;
}

interface DrugItemProps {
  name: string;
  dosages: DrugDosage[];
  additionalInfo?: string;
  effectiveWeight: number;
  showCalculations: boolean;
}

export function DrugItem({
  name,
  dosages,
  additionalInfo,
  effectiveWeight,
  showCalculations,
}: DrugItemProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
      {/* DRUG NAME */}
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
        {name}
      </h3>

      {/* DOSAGES LIST */}
      <div className="mt-4 space-y-3">
        {dosages.map((dosage, idx) => (
          <DosageItem
            key={idx}
            dosage={dosage}
            effectiveWeight={effectiveWeight}
            showCalculations={showCalculations}
          />
        ))}
      </div>

      {/* ADDITIONAL INFO */}
      {additionalInfo && (
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          ℹ️ {additionalInfo}
        </p>
      )}
    </div>
  );
}

function DosageItem({
  dosage,
  effectiveWeight,
  showCalculations,
}: {
  dosage: DrugDosage;
  effectiveWeight: number;
  showCalculations: boolean;
}) {
  let calculation: any = null;
  let displayValue: string = "";

  if (dosage.dosePerKgMin !== undefined && dosage.dosePerKgMax !== undefined) {
    calculation = calculateDoseRange(
      effectiveWeight,
      dosage.dosePerKgMin,
      dosage.dosePerKgMax,
      dosage.maxDose,
      dosage.unit
    );
    const min = calculation.min;
    const max = calculation.max;
    const cappedText = calculation.cappedAt ? " (limitato)" : "";
    displayValue = `${min}–${max} ${dosage.unit}${cappedText}`;
  } else if (dosage.dosePerKg !== undefined) {
    calculation = calculateDosePerKg(
      effectiveWeight,
      dosage.dosePerKg,
      dosage.maxDose,
      dosage.unit
    );
    const cappedText = calculation.capped ? " (limitato)" : "";
    displayValue = `${calculation.dose} ${dosage.unit}${cappedText}`;
  } else if (dosage.doseFixed !== undefined) {
    calculation = calculateFixedDose(dosage.doseFixed, dosage.unit);
    displayValue = `${calculation.dose} ${dosage.unit}`;
  }

  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
      {/* SINISTRA: NOME E DESCRIZIONE | DESTRA: DOSE */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        {/* SINISTRA */}
        <div className="sm:max-w-[60%]">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {dosage.label}
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {dosage.description}
          </p>
        </div>

        {/* DESTRA - DOSE GRANDE E EVIDENTE */}
        <div className="shrink-0 sm:text-right">
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {displayValue}
          </p>
        </div>
      </div>

      {/* FORMULA DI CALCOLO - SE RICHIESTA */}
      {showCalculations && calculation && (
        <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Calcolo: {calculation.formula}
          </p>
        </div>
      )}
    </div>
  );
}
