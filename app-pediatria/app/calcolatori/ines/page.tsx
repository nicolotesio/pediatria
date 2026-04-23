"use client";

import { useState } from "react";
import Link from "next/link";

type InesResult = {
  eg: number;
  sesso: string;
  primogenito: string;
  value: number;
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
  const [eg, setEg] = useState(40);

  const [peso, setPeso] = useState("3500");
  const [lunghezza, setLunghezza] = useState("50");
  const [cc, setCc] = useState("34");

  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCalculate() {
    setLoading(true);

    const pesoNum = peso.trim() === "" ? null : Number(peso);
    const lunghezzaNum = lunghezza.trim() === "" ? null : Number(lunghezza);
    const ccNum = cc.trim() === "" ? null : Number(cc);

    try {
      const res = await fetch("/api/ines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sesso,
          primogenito,
          eg,
          peso: pesoNum,
          lunghezza: lunghezzaNum,
          cc: ccNum,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult(null);
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
          👶 Centili INeS Neonatali
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Peso, lunghezza e circonferenza cranica per neonati italiani (24–42 settimane EG)
        </p>

        <div className="mt-6 space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
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
            <label className="text-sm font-medium">Età gestazionale (settimane): {eg}</label>
            <input
              type="range"
              min={24}
              max={42}
              value={eg}
              onChange={(e) => setEg(Number(e.target.value))}
              className="mt-2 w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>24</span>
              <span>42</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Peso (g)</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="es. 3500"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Lunghezza (cm)</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="es. 50"
              value={lunghezza}
              onChange={(e) => setLunghezza(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Circonferenza cranica (cm)
            </label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="es. 34"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="mt-2 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {loading ? "Calcolo..." : "Calcola"}
          </button>
        </div>

        {result && (
          <div className="mt-6 space-y-4">
            <ResultRow title="Peso" data={result.peso} />
            <ResultRow title="Lunghezza" data={result.lunghezza} />
            <ResultRow title="Circonferenza cranica" data={result.cc} />
          </div>
        )}
      </div>
    </main>
  );
}

function formatDs(zScore: number): string {
  const rounded = Math.round(zScore * 10) / 10;

  if (rounded === 0) return "0 DS";
  if (rounded > 0) return `+${rounded} DS`;
  return `${rounded} DS`;
}

function ResultRow({
  title,
  data,
}: {
  title: string;
  data: InesResult;
}) {
  if (!data) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="min-w-0 sm:max-w-[60%]">
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </p>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Calcolo non disponibile
            </p>
          </div>

          <div className="shrink-0 sm:text-right">
            <p className="text-2xl font-bold text-slate-400 dark:text-slate-500 sm:text-3xl">
              —
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="min-w-0 sm:max-w-[60%]">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {data.value.toFixed(2)} {title === "Peso" ? "g" : "cm"}
          </p>
        </div>

        <div className="shrink-0 sm:text-right">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
            {data.percentile}°
          </p>
          <p className="mt-1 text-base font-medium text-slate-500 dark:text-slate-400">
            {formatDs(data.zScore)}
          </p>
        </div>
      </div>
    </div>
  );
}
