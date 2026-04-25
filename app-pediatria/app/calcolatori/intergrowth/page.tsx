"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonPrimary, formInput, formSelect, pageContainer, pageDescription, pageMain, pageTitle, panel, subtleLink } from "@/components/ui";

type IntergrowthResult = {
  egWeeks: number;
  egDays: number;
  egDecimal: number;
  sex: string;
  value: number;
  zScore: number;
  percentile: number;
  l: number;
  m: number;
  s: number;
} | null;

export default function IntergrowthPage() {
  const [sex, setSex] = useState<"M" | "F">("M");
  const [egWeeks, setEgWeeks] = useState<string>("40");
  const [egDays, setEgDays] = useState<string>("0");
  const [weight, setWeight] = useState("3500");

  const [result, setResult] = useState<IntergrowthResult>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleWeightChange(value: string) {
    const cleaned = value.replace(/[^0-9]/g, "");
    setWeight(cleaned);
  }

  async function handleCalculate() {
    setError(null);
    setResult(null);

    // Validazione settimane
    if (!egWeeks || egWeeks.trim() === "") {
      setError("Inserire le settimane.");
      return;
    }

    const weeksNum = Number(egWeeks);
    if (isNaN(weeksNum) || weeksNum < 22 || weeksNum > 50) {
      setError("Le settimane devono essere comprese tra 22 e 50.");
      return;
    }

    // Validazione giorni
    let daysNum: number;
    if (!egDays || egDays.trim() === "") {
      daysNum = 0;
    } else {
      daysNum = Number(egDays);
    }

    const maxDays = 6;
    if (isNaN(daysNum) || daysNum < 0 || daysNum > maxDays) {
      setError(`I giorni devono essere compresi tra 0 e ${maxDays}.`);
      return;
    }

    // Validazione peso
    if (!weight || weight.trim() === "") {
      setError("Inserire il peso.");
      return;
    }

    const weightNum = Number(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setError("Il peso deve essere un numero positivo.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/intergrowth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sex,
          egWeeks: weeksNum,
          egDays: daysNum,
          weight: weightNum,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result);
      }
    } catch (err) {
      console.error(err);
      setError("Errore nel calcolo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={pageMain}>
      <div className={pageContainer}>
        <div className="mb-6">
          <Link
            href="/calcolatori"
            className={subtleLink}
          >
            ← Torna ai calcolatori
          </Link>
        </div>

        <h1 className={pageTitle}>
          🌍 Centili INTERGROWTH-21
        </h1>

        <p className={pageDescription}>
          Peso alla nascita per neonati da 22 a 50 settimane di età gestazionale
        </p>

        <div className={`${panel} space-y-4`}>
          <div>
            <label className="text-sm font-medium">Sesso</label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value as "M" | "F")}
              className={formSelect}
            >
              <option value="M">Maschio</option>
              <option value="F">Femmina</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Età gestazionale</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400">Settimane (22-50)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Settimane"
                  value={egWeeks}
                  onChange={(e) => setEgWeeks(e.target.value.replace(/[^0-9]/g, ""))}
                  className={formInput}
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400">Giorni (0-6)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Giorni"
                  value={egDays}
                  onChange={(e) => setEgDays(e.target.value.replace(/[^0-9]/g, ""))}
                  className={formInput}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Peso alla nascita (grammi)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="es. 3500"
              value={weight}
              onChange={(e) => handleWeightChange(e.target.value)}
              className={formInput}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleCalculate}
            disabled={loading}
            className={buttonPrimary}
          >
            {loading ? "Calcolo..." : "Calcola"}
          </button>
        </div>

        {result && (
          <ResultRow data={result} />
        )}
      </div>
    </main>
  );
}

function formatDs(zScore: number): string {
  const rounded = Math.round(zScore * 10) / 10;
  if (rounded === 0) return "0 DS";
  return rounded > 0 ? `+${rounded} DS` : `${rounded} DS`;
}

function ResultRow({ data }: { data: IntergrowthResult }) {
  if (!data) return null;

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Peso alla nascita</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {data.value} g
          </p>
        </div>

        <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Centile</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {data.percentile}°
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Deviazione standard</p>
              <p className="text-xl font-medium text-slate-700 dark:text-slate-300">
                {formatDs(data.zScore)}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <p>EG: {data.egWeeks}+{data.egDays} ({data.egDecimal.toFixed(2)} settimane decimali)</p>
          <p className="mt-1">Sesso: {data.sex === "M" ? "Maschio" : "Femmina"}</p>
        </div>
      </div>
    </div>
  );
}
