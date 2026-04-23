"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InesPage() {
  const [settimane, setSettimane] = useState<string>("");
  const [giorni, setGiorni] = useState<string>("");
  const [sesso, setSesso] = useState<"M" | "F">("M");
  const [peso, setPeso] = useState<string>("");
  const [lunghezza, setLunghezza] = useState<string>("");
  const [cc, setCc] = useState<string>("");
  const [risultati, setRisultati] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calcolaPercentili = async () => {
    // Validazione settimane (obbligatorie)
    if (!settimane || parseInt(settimane) < 23 || parseInt(settimane) > 42) {
      setError("Inserisci le settimane (range 23-42)");
      return;
    }

    setLoading(true);
    setError(null);

    // Se i giorni sono vuoti, usiamo il valore predefinito 3
    const giorniVal = giorni === "" ? "3" : giorni;

    try {
      const res = await fetch("/api/ines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settimane: parseInt(settimane),
          giorni: parseInt(giorniVal),
          sesso,
          peso: peso ? parseFloat(peso) : undefined,
          lunghezza: lunghezza ? parseFloat(lunghezza) : undefined,
          cc: cc ? parseFloat(cc) : undefined,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setRisultati(data);
      }
    } catch (err) {
      setError("Errore nel calcolo");
    } finally {
      setLoading(false);
    }
  };

  // Trigger calcolo automatico quando cambiano i valori principali
  useEffect(() => {
    if (settimane) {
      calcolaPercentili();
    }
  }, [settimane, giorni, sesso, peso, lunghezza, cc]);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="shadow-lg border-t-4 border-t-blue-500">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center text-blue-600">
            Calcolatore INeS
          </CardTitle>
          <p className="text-center text-sm text-slate-500 italic">
            Italian Neonatal Study - Curve di crescita neonatali
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Sezione Età Gestazionale */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Età Gestazionale</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Settimane (23-42)"
                  value={settimane}
                  onChange={(e) => setSettimane(e.target.value)}
                  className="w-full rounded-xl border p-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-950"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Giorni (+3 default)"
                  value={giorni}
                  onChange={(e) => setGiorni(e.target.value)}
                  className="w-full rounded-xl border p-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-950"
                />
              </div>
            </div>
          </div>

          {/* Sezione Sesso */}
          <div className="flex justify-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setSesso("M")}
              className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
                sesso === "M" ? "bg-blue-500 text-white shadow-md" : "text-slate-500"
              }`}
            >
              MASCHIO
            </button>
            <button
              onClick={() => setSesso("F")}
              className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
                sesso === "F" ? "bg-pink-500 text-white shadow-md" : "text-slate-500"
              }`}
            >
              FEMMINA
            </button>
          </div>

          {/* Sezione Misure - TUTTE SULLA STESSA RIGA */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Peso (g)</label>
              <input
                type="number"
                placeholder="g"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="w-full rounded-xl border p-3 text-center focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-950"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Lung. (cm)</label>
              <input
                type="number"
                step="0.1"
                placeholder="cm"
                value={lunghezza}
                onChange={(e) => setLunghezza(e.target.value)}
                className="w-full rounded-xl border p-3 text-center focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-950"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">CC (cm)</label>
              <input
                type="number"
                step="0.1"
                placeholder="cm"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                className="w-full rounded-xl border p-3 text-center focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-950"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-xl text-center text-sm font-medium">
              {error}
            </div>
          )}

          {/* Risultati */}
          {risultati && (
            <div className="grid grid-cols-1 gap-4 pt-4 border-t">
              {risultati.peso && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-blue-700 dark:text-blue-300">Percentile Peso:</span>
                  <span className="text-2xl font-black text-blue-800 dark:text-blue-100">
                    {risultati.peso.percentile}°
                  </span>
                </div>
              )}
              {risultati.lunghezza && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">Percentile Lunghezza:</span>
                  <span className="text-2xl font-black text-emerald-800 dark:text-emerald-100">
                    {risultati.lunghezza.percentile}°
                  </span>
                </div>
              )}
              {risultati.cc && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-purple-700 dark:text-purple-300">Percentile CC:</span>
                  <span className="text-2xl font-black text-purple-800 dark:text-purple-100">
                    {risultati.cc.percentile}°
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}