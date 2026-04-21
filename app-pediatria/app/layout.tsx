import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeToggle from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Appunti di Pediatria",
  description: "Webapp personale di studio e supporto clinico",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="mx-auto max-w-5xl p-4">
            <div className="flex justify-end">
              <ThemeToggle />
            </div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}