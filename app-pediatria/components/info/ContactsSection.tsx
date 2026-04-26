"use client";

import { sectionCard } from "@/components/ui";
import { infoContent } from "./content";

export default function ContactsSection() {
  const section = infoContent.contacts;

  return (
    <div className={sectionCard}>
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {section.title}
      </h2>

      <p className="mt-4 text-slate-700 dark:text-slate-300">
        {section.description}
      </p>

      <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <a
          href={`mailto:${section.email}`}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
        >
          ✉️ {section.emailLabel}
        </a>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {section.email}
        </p>
      </div>
    </div>
  );
}
