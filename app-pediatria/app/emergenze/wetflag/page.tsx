"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateWetflag } from "@/lib/calculations/wetflag";

export default function WetflagPage() {
  const [age, setAge] = useState(4);
  const [weight, setWeight] = useState(18);
  const [estimateWeight, setEstimateWeight] = useState(false);

  const estimatedWeight = useMemo(() => {
    return (age + 4) * 2;
  }, [age]);

  const effectiveWeight = useMemo(() => {
    return estimateWeight ? estimatedWeight : weight;
  }, [estimateWeight, estimatedWeight, weight]);

  const result = useMemo(() => {
    return calculateWetflag(effectiveWeight, age);
  }, [effectiveWeight, age]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl p-6">
        <div className="mb-5">
          <Link
            href="/emergenze"
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ← Torna a Emergenze
          </Link>
        </div>

        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            WETFLAG
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Calcoli rapidi da età e peso
          </p>
        </div>

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
              min={1}
              max={12}
              step={0.5}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="mt-3 w-full"
            />

            <div className="mt-1.5 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>1 anno</span>
              <span>12 anni</span>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Peso</label>
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={estimateWeight}
                    onChange={(e) => setEstimateWeight(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Stima da età
                </label>
              </div>

              <span className="text-base font-semibold">
                {estimateWeight
                  ? `${estimatedWeight.toFixed(1)} kg`
                  : `${weight} kg`}
              </span>
            </div>

            <input
              type="range"
              min={10}
              max={70}
              step={1}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              disabled={estimateWeight}
              className={`mt-3 w-full ${estimateWeight ? "opacity-50" : ""}`}
            />

            <div className="mt-1.5 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>10 kg</span>
              <span>70 kg</span>
            </div>

            {estimateWeight && (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Peso stimato con formula: (età + 4) × 2
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Riassunto
          </h2>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <SummaryCard
              label="Età considerata"
              value={age % 1 === 0 ? `${age} anni` : `${age.toFixed(1)} anni`}
            />

            <SummaryCard
              label="Peso considerato"
              value={`${effectiveWeight.toFixed(1)} kg`}
              subtitle={
                estimateWeight ? "Peso stimato da età" : "Peso inserito manualmente"
              }
            />
          </div>
        </div>

        <ResultsSection title="Fluidi">
          <CalcRow label="Bolo 10 mL/kg" value={`${result.fluid10} mL`} />
          <CalcRow label="Bolo 20 mL/kg" value={`${result.fluid20} mL`} />
          <CalcRow
            label="Glucosio 10%"
            value={`${result.glucose10} mL`}
            subtitle="Dose 2 mL/kg"
          />
        </ResultsSection>

        <ResultsSection title="Airway">
          <CalcRow
            label="Tubo ET uncuffed"
            value={`${result.uncuffedTube ?? "-"} mm`}
          />
          <CalcRow
            label="Tubo ET cuffed"
            value={`${result.cuffedTube ?? "-"} mm`}
          />
        </ResultsSection>

        <ResultsSection title="Farmaci">
          <CalcRow
            label="Adrenalina IM anafilassi"
            value={`${result.adrenalineIM} mL`}
            subtitle="Soluzione 1 mg/mL"
          />
          <CalcRow
            label="Adrenalina IV arresto"
            value={`${result.adrenalineIV} mL`}
            subtitle="Soluzione 0.1 mg/mL (1:10.000)"
          />
        </ResultsSection>

        <ResultsSection title="Energia">
          <CalcRow
            label="Defibrillazione"
            value={`${result.defibrillation} J`}
          />
        </ResultsSection>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <p className="font-medium">Nota</p>
          <p className="mt-1.5">
            Questa è una versione iniziale di supporto rapido. Va sempre verificata
            nel contesto clinico e secondo i protocolli locali.
          </p>
        </div>
      </div>
    </main>
  );
}

function ResultsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-sm dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {value}
      </p>
      {subtitle && (
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function CalcRow({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="min-w-0 sm:max-w-[60%]">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {label}
          </p>
          {subtitle && (
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        <div className="shrink-0 sm:text-right">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}