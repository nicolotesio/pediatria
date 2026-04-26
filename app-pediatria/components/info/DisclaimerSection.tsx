"use client";

import { sectionCard } from "@/components/ui";
import { infoContent } from "./content";

export default function DisclaimerSection() {
  const section = infoContent.disclaimer;
  const lines = section.description.split("\n");

  return (
    <div className={`${sectionCard} border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20`}>
      <h2 className="text-2xl font-semibold text-orange-900 dark:text-orange-300">
        ⚠️ {section.title}
      </h2>

      <div className="mt-4 space-y-3 text-orange-800 dark:text-orange-200">
        {lines.map((line, idx) => {
          if (line.trim().startsWith("•")) {
            return (
              <li key={idx} className="ml-6 list-disc font-medium">
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
