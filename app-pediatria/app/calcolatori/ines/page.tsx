"use client";

import { useState } from "react";
import Link from "next/link";

type InesResult = {
  eg: number;
  sesso: string;
  primogenito: string;
  value: number;
  displayValue: string;
  zScore: number;
  percentile: number;
  l: number;
  m: number;
  s: number;
} | null;

type ApiResponse = {
  peso: InesResult;
  lunghezza: InesResult;
  cc: InesResult;
  error?: string;
};

export default function InesPage() {
  const [sesso, setSesso] = useState<"M" | "F">("M");
  const [primogenito, setPrimogenito] = useState<"SI" | "NO">("SI");
  
  const [egWeeks, setEgWeeks] = useState<string>("40");
  const [egDays, setEgDays] = useState<string>("0");

  const [peso, setPeso] = useState("3500");
  const [lunghezza, setLunghezza] = useState("50.0");
  const [cc, setCc] = useState("34.0");

  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handlePesoChange(value: string) {
    const cleaned = value.replace(/[^0-9]/g, "");
    setPeso(cleaned);
  }

  function handleLunghezzaChange(value: string) {
    const cleaned = value.replace(/,/g, ".");
    if (cleaned === "" || cleaned === ".") {
      setLunghezza(cleaned);
      return;
    }
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      setLunghezza(parts[0] + "." + parts[1]);
      return;
    }
    if (parts.length === 2 && parts[1].length > 1) {
      setLunghezza(parts[0] + "." + parts[1][0]);
      return;
    }
    setLunghezza(cleaned);
  }

  function handleCcChange(value: string) {
    const cleaned = value.replace(/,/g, ".");
    if (cleaned === "" || cleaned === ".") {
      setCc(cleaned);
      return;
    }
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      setCc(parts[0] + "." + parts[1]);
      return;
    }
    if (parts.length === 2 && parts[1].length > 1) {
      setCc(parts[0] + "." + parts[1][0]);
      return;
    }
    setCc(cleaned);
  }

  async function handleCalculate() {
    setError(null);
    setResult(null);

    if (!egWeeks || egWeeks.trim() === "") {
      setError("Impossibile eseguire il calcolo: inserire le settimane.");
      return;
    }

    const weeksNum = Number(egWeeks);
    if (isNaN(weeksNum) || weeksNum < 23 || weeksNum > 42) {
      setError("Le settimane devono essere comprese tra 23 e 42.");
      return;
    }

    let daysNum: number;
    if (!egDays || egDays.trim() === "") {
      daysNum = 3;
    } else {
      daysNum = Number(egDays);
    }

    const maxDays = weeksNum === 42 ? 0 : 6;
    if (isNaN(daysNum) || daysNum < 0 || daysNum > maxDays) {
      setError(weeksNum === 42 
        ? "A 42 settimane i giorni devono essere 0." 
        : `I giorni devono essere compresi tra 0 e ${maxDays}.`
      );
      return;
    }

    setLoading(true);

    const pesoNum = peso.trim() === "" ? null : Number(peso);
    const lunghezzaNum = lunghezza.trim() === "" ? null : Number(lunghezza);
    const ccNum = cc.trim() === "" ? null : Number(cc);

    try {
      const res = await fetch("/api/ines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sesso,
          primogenito,
          egWeeks: weeksNum,
          egDays: daysNum,
          peso: pesoNum,
          pesoDisplay: peso,
          lunghezza: lunghezzaNum,
          lunghezzaDisplay: lunghezza,
          cc: ccNum,
          ccDisplay: cc,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      setError("Errore nel calcolo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl p-6">
        <div className="mb-6">
          <Link
            href="/calcolatori"
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ← Torna ai calcolatori
          </Link>
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          👶 Centili neonatali INeS
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Peso, lunghezza e circonferenza cranica per neonati italiani (23–42 settimane EG)
        </p>

        <div className="mt-6 space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Sesso</label>
              <select
                value={sesso}
                onChange={(e) => setSesso(e.target.value as "M" | "F")}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="M">Maschio</option>
                <option value="F">Femmina</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Primogenito</label>
              <select
                value={primogenito}
                onChange={(e) => setPrimogenito(e.target.value as "SI" | "NO")}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="SI">Sì</option>
                <option value="NO">No</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Età gestazionale</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400">Settimane (23-42)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Settimane"
                  value={egWeeks}
                  onChange={(e) => setEgWeeks(e.target.value.replace(/[^0-9]/g, ""))}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400">Giorni (0-6 o vuoto)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="+3 (default)"
                  value={egDays}
                  onChange={(e) => setEgDays(e.target.value.replace(/[^0-9]/g, ""))}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Peso (g)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="es. 3500"
              value={peso}
              onChange={(e) => handlePesoChange(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Lunghezza (cm)</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="es. 50.0"
                value={lunghezza}
                onChange={(e) => handleLunghezzaChange(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Circonferenza (cm)</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="es. 34.0"
                value={cc}
                onChange={(e) => handleCcChange(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Calcolo..." : "Calcola"}
          </button>
        </div>

        {result && (
          <div className="mt-6 space-y-4">
            {result.peso && <ResultRow title="Peso" data={result.peso} unit="g" />}
            {result.lunghezza && <ResultRow title="Lunghezza" data={result.lunghezza} unit="cm" />}
            {result.cc && <ResultRow title="Circonferenza cranica" data={result.cc} unit="cm" />}
          </div>
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

function ResultRow({ title, data, unit }: { title: string; data: InesResult; unit: string }) {
  if (!data) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="min-w-0 sm:max-w-[60%]">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {data.value} {unit}
          </p>
        </div>
        <div className="shrink-0 sm:text-right">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
            {data.percentile}° centile
          </p>
          <p className="mt-1 text-base font-medium text-slate-500 dark:text-slate-400">
            {formatDs(data.zScore)}
          </p>
        </div>
      </div>
    </div>
  );
}