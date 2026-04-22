"use client";

import { useState } from "react";
import Link from "next/link";

type WhoResult = {
  x: number;
  value: number;
  zScore: number;
  percentile: number;
  l: number;
  m: number;
  s: number;
  interpretation?: {
    label: string;
    tone: "red" | "amber" | "green" | "blue";
  };
} | null;

type ApiResponse = {
  weight: WhoResult;
  length: WhoResult;
  head: WhoResult;
  weightForLength: WhoResult;
  error?: string;
};

export default function WHOPage() {
  const [sex, setSex] = useState<"boys" | "girls">("boys");
  const [month, setMonth] = useState(6);

  const [weight, setWeight] = useState("7");
  const [length, setLength] = useState("65");
  const [head, setHead] = useState("42");

  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCalculate() {
    setLoading(true);

    const weightNum = weight.trim() === "" ? null : Number(weight);
    const lengthNum = length.trim() === "" ? null : Number(length);
    const headNum = head.trim() === "" ? null : Number(head);

    try {
      const res = await fetch("/api/who", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sex,
          month,
          weight: weightNum,
          length: lengthNum,
          head: headNum,
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
          📈 Centili WHO 0–2 anni
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Peso, lunghezza, circonferenza cranica e peso per lunghezza
        </p>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div>
            <label className="text-sm font-medium">Sesso</label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value as "boys" | "girls")}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="boys">Maschio</option>
              <option value="girls">Femmina</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Età (mesi): {month}</label>
            <input
              type="range"
              min={0}
              max={24}
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="mt-2 w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>0</span>
              <span>24</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Peso (kg)</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="es. 7.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Lunghezza (cm)</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="es. 65"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Circonferenza cranica (cm)</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="es. 42"
              value={head}
              onChange={(e) => setHead(e.target.value)}
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
            <ResultCard title="Peso per età" data={result.weight} />
            <ResultCard title="Lunghezza per età" data={result.length} />
            <ResultCard title="Circonferenza cranica per età" data={result.head} />
            <ResultCard title="Peso per lunghezza" data={result.weightForLength} />
          </div>
        )}
      </div>
    </main>
  );
}

function ResultCard({
  title,
  data,
}: {
  title: string;
  data: WhoResult;
}) {
  if (!data) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className="mt-2 text-lg text-slate-400 dark:text-slate-500">
          Calcolo non disponibile
        </p>
      </div>
    );
  }

  const toneMap = {
    red: "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900",
    amber: "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900",
    green: "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900",
    blue: "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900",
  };

  const toneClass = data.interpretation ? toneMap[data.interpretation.tone] : "";

  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${toneClass || "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"}`}>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {data.percentile}°
        </p>
        {data.interpretation && (
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {data.interpretation.label}
          </p>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
        z-score: {data.zScore}
      </p>
    </div>
  );
}