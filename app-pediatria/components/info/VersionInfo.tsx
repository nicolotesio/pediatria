"use client";

import { panel } from "@/components/ui";
import { infoContent } from "./content";

export default function VersionInfo() {
  const info = infoContent.version;

  return (
    <div className={`${panel} flex items-center justify-between`}>
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {info.label}
      </span>
      <span className="rounded-lg bg-slate-100 px-3 py-1 font-mono text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-100">
        v{info.value}
      </span>
    </div>
  );
}
