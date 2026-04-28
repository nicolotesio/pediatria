"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { emergencyDrugsData, Drug, DrugCategory } from "@/lib/emergency-drugs/emergencyDrugData";
import {
  calculateDosePerKg,
  calculateFixedDose,
  calculateDoseRange,
  CalculationResult,
} from "@/lib/emergency-drugs/emergencyDrugCalculations";
import { pageContainer, pageDescription, pageMain, pageTitle, subtleLink } from "@/components/ui";
import { InputCard } from "@/components/emergency-drugs/InputCard";
import { InfoBox } from "@/components/emergency-drugs/InfoBox";
import { DrugItem } from "@/components/emergency-drugs/DrugItem";

export default function FarmaciEmergenzaPage() {
  const [weight, setWeight] = useState(25);
  const [age, setAge] = useState(5);
  const [estimateWeight, setEstimateWeight] = useState(false);

  // Calcola il peso stimato da età
  const estimatedWeight = useMemo(() => {
    return (age + 4) * 2;
  }, [age]);

  // Peso effettivo per i calcoli (capped a 70 kg)
  const effectiveWeight = useMemo(() => {
    const weight_to_use = estimateWeight ? estimatedWeight : weight;
    return Math.min(weight_to_use, 70);
  }, [estimateWeight, estimatedWeight, weight]);

  // Verifica se il peso è stato capped
  const weightCapped = useMemo(() => {
    const weight_to_use = estimateWeight ? estimatedWeight : weight;
    return weight_to_use > 70;
  }, [estimateWeight, estimatedWeight, weight]);

  // Formattazione per la visualizzazione
  const displayAge = useMemo(() => {
    return age % 1 === 0 ? `${age} anni` : `${age.toFixed(1)} anni`;
  }, [age]);

  const displayWeight = useMemo(() => {
    const w = estimateWeight ? estimatedWeight : weight;
    return w % 1 === 0 ? `${w} kg` : `${w.toFixed(1)} kg`;
  }, [weight, estimateWeight, estimatedWeight]);

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

        {/* INPUT SECTION - REPLICA WETFLAG */}
        <InputCard
          age={age}
          setAge={setAge}
          weight={weight}
          setWeight={setWeight}
          estimateWeight={estimateWeight}
          setEstimateWeight={setEstimateWeight}
        />

        {/* INFO BOXES - SEMPRE VISIBILI */}
        <InfoBox type="info" title="Neonati e basso peso">
          Età inferiore a 1 anno o peso inferiore a 10 kg — considerare linee guida neonatali ALS
          o fare riferimento a RCUK.
        </InfoBox>

        <InfoBox type="info" title="Bambini grandi e adolescenti">
          Nei bambini con peso corporeo elevato, considerare il dosaggio sul peso ideale per i farmaci
          idrofili. Per età superiore a 12 anni possono essere utilizzati algoritmi per adulti, secondo
          giudizio clinico.
        </InfoBox>

        {/* SUMMARY */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Riepilogo</p>
          <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Età: {displayAge} | Peso: {displayWeight}
          </p>
          {estimateWeight && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Peso stimato con formula: (età + 4) × 2
            </p>
          )}
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
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* CATEGORY HEADER - ACCORDION TOGGLE */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full transition"
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

      {/* CATEGORY CONTENT - COLLAPSIBLE - DENTRO LA STESSA CARD */}
      {isOpen && (
        <div className="mt-6 space-y-6 border-t border-slate-200 pt-6 dark:border-slate-800">
          {/* TOGGLE FOR CALCULATIONS */}
          <div className="flex items-center gap-3">
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
        <DrugItem
          key={idx}
          name={drug.name}
          dosages={drug.dosages}
          additionalInfo={drug.additionalInfo}
          effectiveWeight={effectiveWeight}
          showCalculations={showCalculations}
        />
      ))}
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
