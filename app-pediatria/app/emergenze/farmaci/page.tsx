"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { emergencyDrugsData, Drug, DrugCategory } from "@/lib/emergency-drugs/emergencyDrugData";
import {
  calculateDosePerKg,
  calculateFixedDose,
  calculateDoseRange,
  getWeightAlertStatus,
  getEffectiveWeight,
  CalculationResult,
} from "@/lib/emergency-drugs/emergencyDrugCalculations";
import { pageContainer, pageDescription, pageMain, pageTitle, subtleLink } from "@/components/ui";

export default function FarmaciEmergenzaPage() {
  const [weight, setWeight] = useState(25);
  const [age, setAge] = useState(5);
  const [useAge, setUseAge] = useState(false);

  // Calcoli derivati
  const { effective: effectiveWeight, capped: weightCapped } = useMemo(
    () => getEffectiveWeight(weight),
    [weight]
  );

  const weightAlert = useMemo(
    () => getWeightAlertStatus(weight, age),
    [weight, age]
  );

  const displayAge = useMemo(() => {
    return age === Math.floor(age) ? `${age} anni` : `${age.toFixed(1)} anni`;
  }, [age]);

  const displayWeight = useMemo(
    () => (weight % 1 === 0 ? `${weight} kg` : `${weight.toFixed(1)} kg`),
    [weight]
  );

  return (
    <main className={pageMain}>
      <div className={pageContainer}>
        {/* BACK LINK */}
        <div className="mb-5">
          <Link href="/emergenze" className={subtleLink}>
            ← Torna a Emergenze
          </Link>
        </div>

        {/* TITLE */}
        <div>
          <h1 className={`flex items-center gap-2 ${pageTitle}`}>
            <span>💊</span>
            Farmaci in emergenza pediatrica
          </h1>
          <p className={pageDescription}>
            Calcolatore di dosaggi pediatrici in emergenza
          </p>
        </div>

        {/* INPUT SECTION */}
        <InputSection
          weight={weight}
          setWeight={setWeight}
          age={age}
          setAge={setAge}
          useAge={useAge}
          setUseAge={setUseAge}
        />

        {/* ALERTS */}
        {weightAlert.level === "red" && (
          <AlertBox type="error" message={weightAlert.message!} />
        )}
        {weightAlert.level === "yellow" && (
          <AlertBox type="warning" message={weightAlert.message!} />
        )}

        {/* SUMMARY */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Riepilogo
          </p>
          <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Età: {displayAge} | Peso: {displayWeight}
          </p>
          {weightCapped && (
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
              I calcoli verranno effettuati su 70 kg (peso massimo)
            </p>
          )}
        </div>

        {/* DRUG CATEGORIES */}
        {emergencyDrugsData.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            effectiveWeight={effectiveWeight}
          />
        ))}

        {/* DISCLAIMER */}
        <DisclaimerBox />
      </div>
    </main>
  );
}

// ============================================================================
// COMPONENT: InputSection
// ============================================================================

function InputSection({
  weight,
  setWeight,
  age,
  setAge,
  useAge,
  setUseAge,
}: {
  weight: number;
  setWeight: (w: number) => void;
  age: number;
  setAge: (a: number) => void;
  useAge: boolean;
  setUseAge: (u: boolean) => void;
}) {
  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Età</label>
          <span className="text-base font-semibold">
            {age % 1 === 0 ? `${age} anni` : `${age.toFixed(1)} anni`}
          </span>
        </div>

        <input
          type="range"
          min={0.5}
          max={18}
          step={0.5}
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="mt-3 w-full"
        />

        <div className="mt-1.5 flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>0.5 anni (6 mesi)</span>
          <span>18 anni</span>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Peso</label>
          </div>
          <span className="text-base font-semibold">
            {weight % 1 === 0 ? `${weight} kg` : `${weight.toFixed(1)} kg`}
          </span>
        </div>

        <input
          type="range"
          min={3}
          max={100}
          step={0.5}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="mt-3 w-full"
        />

        <div className="mt-1.5 flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>3 kg</span>
          <span>100 kg</span>
        </div>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          💡 Nota: Inserire il peso effettivo del paziente. Se non disponibile, sarà implementato in futuro uno stimatore dal peso.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: AlertBox
// ============================================================================

function AlertBox({
  type,
  message,
}: {
  type: "error" | "warning";
  message: string;
}) {
  const bgColor =
    type === "error"
      ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
      : "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800";

  const textColor =
    type === "error"
      ? "text-red-800 dark:text-red-100"
      : "text-yellow-800 dark:text-yellow-100";

  const iconColor = type === "error" ? "🔴" : "🟡";

  return (
    <div className={`mt-6 rounded-3xl border ${bgColor} p-5`}>
      <p className={`flex items-start gap-3 text-base font-medium ${textColor}`}>
        <span className="mt-0.5">{iconColor}</span>
        <span>{message}</span>
      </p>
    </div>
  );
}

// ============================================================================
// COMPONENT: CategorySection
// ============================================================================

function CategorySection({
  category,
  effectiveWeight,
}: {
  category: DrugCategory;
  effectiveWeight: number;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [showCalculations, setShowCalculations] = useState(false);

  const hasSubsections = category.subsections && category.subsections.length > 0;

  return (
    <section className="mt-8">
      {/* CATEGORY HEADER - ACCORDION TOGGLE */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-left text-lg font-bold text-slate-900 dark:text-slate-100">
            {category.title}
          </h2>
          <span className="shrink-0 text-2xl text-slate-600 dark:text-slate-300">
            {isOpen ? "▼" : "▶"}
          </span>
        </div>
      </button>

      {/* CATEGORY CONTENT - COLLAPSIBLE */}
      {isOpen && (
        <div className="mt-4 space-y-6">
          {/* TOGGLE FOR CALCULATIONS */}
          <div className="flex items-center gap-3 px-2">
            <button
              onClick={() => setShowCalculations(!showCalculations)}
              className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {showCalculations ? "📖 Nascondi calcoli" : "📊 Mostra calcoli"}
            </button>
          </div>

          {/* DISPLAY DRUGS */}
          {hasSubsections ? (
            category.subsections!.map((subsection, idx) => (
              <SubsectionContent
                key={idx}
                subsection={subsection}
                effectiveWeight={effectiveWeight}
                showCalculations={showCalculations}
              />
            ))
          ) : (
            <DrugsList
              drugs={category.drugs!}
              effectiveWeight={effectiveWeight}
              showCalculations={showCalculations}
            />
          )}

          {/* CONCLUSION IF ANY */}
          {category.conclusion && (
            <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {category.conclusion}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

// ============================================================================
// COMPONENT: SubsectionContent
// ============================================================================

function SubsectionContent({
  subsection,
  effectiveWeight,
  showCalculations,
}: {
  subsection: any;
  effectiveWeight: number;
  showCalculations: boolean;
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {subsection.title}
      </h3>
      <DrugsList
        drugs={subsection.drugs}
        effectiveWeight={effectiveWeight}
        showCalculations={showCalculations}
      />
      {subsection.additionalNotes && (
        <p className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-200">
          {subsection.additionalNotes}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// COMPONENT: DrugsList
// ============================================================================

function DrugsList({
  drugs,
  effectiveWeight,
  showCalculations,
}: {
  drugs: Drug[];
  effectiveWeight: number;
  showCalculations: boolean;
}) {
  return (
    <div className="space-y-4">
      {drugs.map((drug, idx) => (
        <DrugCard
          key={idx}
          drug={drug}
          effectiveWeight={effectiveWeight}
          showCalculations={showCalculations}
        />
      ))}
    </div>
  );
}

// ============================================================================
// COMPONENT: DrugCard
// ============================================================================

function DrugCard({
  drug,
  effectiveWeight,
  showCalculations,
}: {
  drug: Drug;
  effectiveWeight: number;
  showCalculations: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
        {drug.name}
      </h3>

      <div className="mt-4 space-y-3">
        {drug.dosages.map((dosage, idx) => (
          <DosageRow
            key={idx}
            dosage={dosage}
            effectiveWeight={effectiveWeight}
            showCalculations={showCalculations}
          />
        ))}
      </div>

      {drug.additionalInfo && (
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          ℹ️ {drug.additionalInfo}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// COMPONENT: DosageRow
// ============================================================================

function DosageRow({
  dosage,
  effectiveWeight,
  showCalculations,
}: {
  dosage: any;
  effectiveWeight: number;
  showCalculations: boolean;
}) {
  // Calcola la dose
  let calculation: CalculationResult | { min: number; max: number; formula: string } | null = null;
  let displayValue: string = "";

  if (dosage.dosePerKgMin !== undefined && dosage.dosePerKgMax !== undefined) {
    // Range di dosaggio (es. Adenosina 0.1-0.2 mg/kg)
    calculation = calculateDoseRange(
      effectiveWeight,
      dosage.dosePerKgMin,
      dosage.dosePerKgMax,
      dosage.maxDose,
      dosage.unit
    );
    const min = (calculation as any).min;
    const max = (calculation as any).max;
    const cappedText = (calculation as any).cappedAt ? " (limitato)" : "";
    displayValue = `${min}–${max} ${dosage.unit}${cappedText}`;
  } else if (dosage.dosePerKg !== undefined) {
    calculation = calculateDosePerKg(
      effectiveWeight,
      dosage.dosePerKg,
      dosage.maxDose,
      dosage.unit
    );
    const cappedText = calculation.capped ? " (limitato)" : "";
    displayValue = `${(calculation as CalculationResult).dose} ${dosage.unit}${cappedText}`;
  } else if (dosage.doseFixed !== undefined) {
    calculation = calculateFixedDose(dosage.doseFixed, dosage.unit);
    displayValue = `${(calculation as CalculationResult).dose} ${dosage.unit}`;
  }

  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
      {/* LABEL E DOSE EVIDENZIATA */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {dosage.label}
        </p>
        <p className="shrink-0 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {displayValue}
        </p>
      </div>

      {/* DESCRIPTION */}
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {dosage.description}
      </p>

      {/* CALCULATIONS - TOGGLE */}
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

// ============================================================================
// COMPONENT: DisclaimerBox
// ============================================================================

function DisclaimerBox() {
  return (
    <div className="mt-10 rounded-3xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-700 dark:bg-amber-950">
      <p className="flex items-start gap-3 text-base font-semibold text-amber-900 dark:text-amber-100">
        <span className="mt-0.5 text-xl">⚠️</span>
        <span>
          Solo riferimento educativo. Confermare sempre con protocolli locali e con le più recenti linee guida ALS pediatriche.
        </span>
      </p>
    </div>
  );
}
