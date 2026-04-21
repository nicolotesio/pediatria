"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  calculateWetflag,
  estimateWeightFromAge,
} from "@/lib/calculations/wetflag";

type InputMode = "weight" | "age";

export default function WetflagPage() {
  const [mode, setMode] = useState<InputMode>("weight");
  const [weight, setWeight] = useState(15);
  const [age, setAge] = useState(3);

  const derivedWeight = useMemo(() => {
    return mode === "weight" ? weight : estimateWeightFromAge(age);
  }, [mode, weight, age]);

  const result = useMemo(() => {
    return calculateWetflag(derivedWeight, mode === "age" ? age : undefined);
  }, [derivedWeight, mode, age]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-6">
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
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Calcoli rapidi da peso o da età stimata
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMode("weight")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "weight"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              }`}
            >
              Usa peso
            </button>

            <button
              type="button"
              onClick={() => setMode("age")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "age"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              }`}
            >
              Usa età
            </button>
          </div>

          {mode === "weight" ? (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Peso</label>
                <span className="text-lg font-semibold">{weight} kg</span>
              </div>

              <input
                type="range"
                min={1}
                max={80}
                step={1}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="mt-4 w-full"
              />

              <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>1 kg</span>
                <span>80 kg</span>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Età</label>
                <span className="text-lg font-semibold">{age} anni</span>
              </div>

              <input
                type="range"
                min={0}
                max={14}
                step={1}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="mt-4 w-full"
              />

              <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>0 anni</span>
                <span>14 anni</span>
              </div>

              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Peso stimato con formula: (età × 2) + 8
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <ResultCard
            title="Peso usato"
            value={`${result.weightKg} kg`}
          />
          <ResultCard
            title="Bolo fluidi 10 mL/kg"
            value={`${result.fluid10} mL`}
          />
          <ResultCard
            title="Bolo fluidi 20 mL/kg"
            value={`${result.fluid20} mL`}
          />
          <ResultCard
            title="ET uncuffed"
            value={
              result.uncuffedTube !== undefined
                ? `${result.uncuffedTube} mm`
                : "Inserisci età"
            }
          />
          <ResultCard
            title="ET cuffed"
            value={
              result.cuffedTube !== undefined
                ? `${result.cuffedTube} mm`
                : "Inserisci età"
            }
          />
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <p className="font-medium">Nota</p>
          <p className="mt-2">
            Questa è una versione iniziale di supporto rapido. Va sempre verificata
            nel contesto clinico e secondo i protocolli locali.
          </p>
        </div>
      </div>
    </main>
  );
}

function ResultCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}