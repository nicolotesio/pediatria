"use client";

import { useMemo } from "react";

interface InputCardProps {
  age: number;
  setAge: (age: number) => void;
  weight: number;
  setWeight: (weight: number) => void;
  estimateWeight: boolean;
  setEstimateWeight: (estimate: boolean) => void;
}

export function InputCard({
  age,
  setAge,
  weight,
  setWeight,
  estimateWeight,
  setEstimateWeight,
}: InputCardProps) {
  const estimatedWeight = useMemo(() => {
    return (age + 4) * 2;
  }, [age]);

  const displayAge = useMemo(() => {
    return age % 1 === 0 ? `${age} anni` : `${age.toFixed(1)} anni`;
  }, [age]);

  const displayWeight = useMemo(() => {
    return estimateWeight
      ? `${estimatedWeight.toFixed(1)} kg`
      : weight % 1 === 0
        ? `${weight} kg`
        : `${weight.toFixed(1)} kg`;
  }, [weight, estimateWeight, estimatedWeight]);

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* ETA SLIDER */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Età</label>
          <span className="text-base font-semibold">{displayAge}</span>
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

      {/* PESO SLIDER E CHECKBOX */}
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

          <span className="text-base font-semibold">{displayWeight}</span>
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
  );
}
