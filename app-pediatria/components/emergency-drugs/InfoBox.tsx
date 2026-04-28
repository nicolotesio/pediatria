"use client";

interface InfoBoxProps {
  type: "info" | "warning";
  title: string;
  children: React.ReactNode;
}

export function InfoBox({ type, title, children }: InfoBoxProps) {
  const isWarning = type === "warning";
  const bgColor = isWarning
    ? "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800"
    : "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800";

  const titleColor = isWarning
    ? "text-amber-900 dark:text-amber-100"
    : "text-blue-900 dark:text-blue-100";

  const textColor = isWarning
    ? "text-amber-800 dark:text-amber-100"
    : "text-blue-800 dark:text-blue-100";

  const icon = isWarning ? "⚠️" : "ℹ️";

  return (
    <div className={`mt-4 rounded-3xl border ${bgColor} p-5`}>
      <p className={`flex items-start gap-3 text-sm font-semibold ${titleColor}`}>
        <span className="shrink-0 text-lg">{icon}</span>
        <span>{title}</span>
      </p>
      <p className={`mt-2 text-sm ${textColor}`}>{children}</p>
    </div>
  );
}
