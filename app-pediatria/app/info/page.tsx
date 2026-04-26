"use client";

import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { pageContainer, pageDescription, pageMain, pageTitle } from "@/components/ui";
import ProjectSection from "@/components/info/ProjectSection";
import DisclaimerSection from "@/components/info/DisclaimerSection";
import ContactsSection from "@/components/info/ContactsSection";
import VersionInfo from "@/components/info/VersionInfo";

export default function InfoPage() {
  return (
    <main className={pageMain}>
      <div className={pageContainer}>
        {/* HEADER */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-4"
            >
              ← Back
            </Link>

            <h1 className={pageTitle}>Informazioni</h1>

            <p className={pageDescription}>
              Dettagli sull'app, disclaimer medico e contatti
            </p>
          </div>

          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-6">
          <ProjectSection />
          <DisclaimerSection />
          <ContactsSection />
          <VersionInfo />
        </div>
      </div>
    </main>
  );
}
