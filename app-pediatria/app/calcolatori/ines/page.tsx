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
    const daysNum = egDays === "" ? 3 : parseInt(egDays);

    if (weeksNum < 23 || weeksNum > 42) {
      setError("Settimane non valide (23-42)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sesso,
          primogenito: "SI",
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
    <main className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-md">
        <Link href="/calcolatori" className="text-sm text-slate-500 mb-4 block">← Torna indietro</Link>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 border border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Centili INeS</h1>

          <div className="space-y-4">
            {/* EG */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase px-1">Settimane</label>
                <input type="number" value={egWeeks} onChange={(e) => setEgWeeks(e.target.value)} className="w-full p-3 rounded-xl border dark:bg-slate-950" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase px-1">Giorni (+3 default)</label>
                <input type="number" value={egDays} onChange={(e) => setEgDays(e.target.value)} className="w-full p-3 rounded-xl border dark:bg-slate-950" />
              </div>
            </div>

            {/* Sesso */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button onClick={() => setSesso("M")} className={`flex-1 py-2 rounded-lg font-bold ${sesso === "M" ? "bg-blue-500 text-white" : "text-slate-500"}`}>M</button>
              <button onClick={() => setSesso("F")} className={`flex-1 py-2 rounded-lg font-bold ${sesso === "F" ? "bg-pink-500 text-white" : "text-slate-500"}`}>F</button>
            </div>

            {/* Misure sulla stessa riga */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase text-center block">Peso (g)</label>
                <input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} className="w-full p-2 rounded-lg border text-center dark:bg-slate-950" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase text-center block">Lung (cm)</label>
                <input type="number" step="0.1" value={lunghezza} onChange={(e) => setLunghezza(e.target.value)} className="w-full p-2 rounded-lg border text-center dark:bg-slate-950" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase text-center block">CC (cm)</label>
                <input type="number" step="0.1" value={cc} onChange={(e) => setCc(e.target.value)} className="w-full p-2 rounded-lg border text-center dark:bg-slate-950" />
              </div>
            </div>

            {error && <p className="text-red-500 text-center text-sm">{error}</p>}

            <button onClick={handleCalculate} disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50">
              {loading ? "Calcolo..." : "CALCOLA"}
            </button>
          </div>

          {result && (
            <div className="mt-8 space-y-3 border-t pt-6">
              <ResultBox title="Peso" res={result.peso} color="blue" />
              <ResultBox title="Lunghezza" res={result.lunghezza} color="emerald" />
              <ResultBox title="Circonferenza" res={result.cc} color="purple" />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ResultBox({ title, res, color }: { title: string, res: InesResult, color: string }) {
  if (!res) return null;
  return (
    <div className={`p-4 rounded-2xl flex justify-between items-center bg-${color}-50 dark:bg-${color}-900/20`}>
      <span className="font-bold">{title}</span>
      <div className="text-right">
        <p className="text-2xl font-black">{res.percentile}°</p>
        <p className="text-xs opacity-60">{res.zScore.toFixed(1)} DS</p>
      </div>
    </div>
  );
}