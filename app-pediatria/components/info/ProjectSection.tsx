"use client";

import { sectionCard } from "@/components/ui";
import { infoContent } from "./content";

export default function ProjectSection() {
  const section = infoContent.project;
  const lines = section.description.split("\n");

  return (
    <div className={sectionCard}>
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {section.title}
      </h2>

      <div className="mt-4 space-y-3 text-slate-700 dark:text-slate-300">
        {lines.map((line, idx) => {
          if (line.trim().startsWith("•")) {
            return (
              <li key={idx} className="ml-6 list-disc">
                {line.replace("•", "").trim()}
              </li>
            );
          }
          if (line.trim() === "") return null;
          return (
            <p key={idx} className="leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}
