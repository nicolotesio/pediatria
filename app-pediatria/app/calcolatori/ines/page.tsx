"use client";

import { useState } from "react";
import Link from "next/link";

type InesResult = {
  displayValue: string;
  zScore: number;
  percentile: number;
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

  async function handleCalculate() {
    setError(null);
    if (!egWeeks || egWeeks.trim() === "") {
      setError("Inserire le settimane (23-42)");
      return;
    }

    const weeksNum = parseInt(egWeeks);
    const daysNum = egDays === "" ? 0 : parseInt(egDays);

    setLoading(true);
    try {
      const res = await fetch("/api/ines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sesso,
          primogenito,
          egWeeks: weeksNum,
          egDays: daysNum,
          peso: parseFloat(peso),
          lunghezza: parseFloat(lunghezza),
          cc: parseFloat(cc),
        }),
      });

      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch (err) {
      setError("Errore di connessione");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-md">
        <Link href="/calcolatori" className="text-sm text-slate-500 mb-4 block">← Torna ai calcolatori</Link>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-800">
          <h1 className="text-xl font-bold mb-6 text-center">Calcolatore Centili INeS</h1>

          <div className="space-y-6">
            {/* Sesso e Primogenito */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sesso</label>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <button onClick={() => setSesso("M")} className={`flex-1 py-1.5 rounded-md text-sm font-semibold transition-all ${sesso === "M" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500"}`}>M</button>
                  <button onClick={() => setSesso("F")} className={`flex-1 py-1.5 rounded-md text-sm font-semibold transition-all ${sesso === "F" ? "bg-white dark:bg-slate-700 shadow-sm text-pink-600" : "text-slate-500"}`}>F</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Primogenito</label>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <button onClick={() => setPrimogenito("SI")} className={`flex-1 py-1.5 rounded-md text-sm font-semibold transition-all ${primogenito === "SI" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500"}`}>SI</button>
                  <button onClick={() => setPrimogenito("NO")} className={`flex-1 py-1.5 rounded-md text-sm font-semibold transition-all ${primogenito === "NO" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500"}`}>NO</button>
                </div>
              </div>
            </div>

            {/* Età Gestazionale */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Settimane EG</label>
                <input type="number" value={egWeeks} onChange={(e) => setEgWeeks(e.target.value)} className="w-full p-2.5 rounded-lg border dark:bg-slate-950 dark:border-slate-700" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Giorni</label>
                <input type="number" value={egDays} onChange={(e) => setEgDays(e.target.value)} className="w-full p-2.5 rounded-lg border dark:bg-slate-950 dark:border-slate-700" />
              </div>
            </div>

            {/* Misure su righe separate */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Peso (grammi)</label>
                <input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} className="w-full p-2.5 rounded-lg border dark:bg-slate-950 dark:border-slate-700" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Lunghezza (cm)</label>
                <input type="number" step="0.1" value={lunghezza} onChange={(e) => setLunghezza(e.target.value)} className="w-full p-2.5 rounded-lg border dark:bg-slate-950 dark:border-slate-700" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Circonferenza Cranica (cm)</label>
                <input type="number" step="0.1" value={cc} onChange={(e) => setCc(e.target.value)} className="w-full p-2.5 rounded-lg border dark:bg-slate-950 dark:border-slate-700" />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

            <button onClick={handleCalculate} disabled={loading} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? "Calcolo in corso..." : "CALCOLA PERCENTILI"}
            </button>
          </div>

          {result && (
            <div className="mt-8 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <ResultRow title="Peso" res={result.peso} />
              <ResultRow title="Lunghezza" res={result.lunghezza} />
              <ResultRow title="Circ. Cranica" res={result.cc} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ResultRow({ title, res }: { title: string, res: InesResult }) {
  if (!res) return null;
  return (
    <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
      <span className="font-medium text-slate-600 dark:text-slate-400">{title}</span>
      <div className="text-right">
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{res.percentile}° centile</span>
        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Z-Score: {res.zScore.toFixed(2)}</p>
      </div>
    </div>
  );
}