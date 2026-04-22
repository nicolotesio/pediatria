"use client";

import { useState } from "react";
import Link from "next/link";

export default function WHOPage() {
  const [sex, setSex] = useState<"boys" | "girls">("boys");
  const [month, setMonth] = useState(6);
  const [weight, setWeight] = useState(7);
  const [length, setLength] = useState(65);
  const [head, setHead] = useState(42);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleCalculate() {
    setLoading(true);

    const res = await fetch("/api/who", {
      method: "POST",
      body: JSON.stringify({
        sex,
        month,
        weight,
        length,
        head,
      }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl p-6">

        <div className="mb-6">
          <Link href="/calcolatori" className="text-sm text-slate-500">
            ← Torna ai calcolatori
          </Link>
        </div>

        <h1 className="text-4xl font-bold">📈 Centili WHO</h1>

        {/* INPUT */}
        <div className="mt-6 rounded-3xl bg-white p-5 dark:bg-slate-900 space-y-4">

          <div>
            <label>Sesso</label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value as any)}
              className="mt-1 w-full rounded-lg border p-2"
            >
              <option value="boys">Maschio</option>
              <option value="girls">Femmina</option>
            </select>
          </div>

          <div>
            <label>Età (mesi): {month}</label>
            <input
              type="range"
              min={0}
              max={24}
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label>Peso (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>

          <div>
            <label>Lunghezza (cm)</label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>

          <div>
            <label>Circonferenza cranica (cm)</label>
            <input
              type="number"
              value={head}
              onChange={(e) => setHead(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="mt-4 w-full rounded-xl bg-blue-600 text-white py-3 font-semibold"
          >
            {loading ? "Calcolo..." : "Calcola"}
          </button>
        </div>

        {/* RISULTATI */}
        {result && (
          <div className="mt-6 space-y-4">

            <ResultCard title="Peso" data={result.weight} />
            <ResultCard title="Lunghezza" data={result.length} />
            <ResultCard title="Circonferenza cranica" data={result.head} />

          </div>
        )}
      </div>
    </main>
  );
}

function ResultCard({ title, data }: any) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow dark:bg-slate-900">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold">
        {data.percentile}°
      </p>
      <p className="text-sm text-slate-400">
        z-score: {data.zScore}
      </p>
    </div>
  );
}