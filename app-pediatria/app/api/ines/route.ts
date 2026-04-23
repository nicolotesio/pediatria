import { NextRequest, NextResponse } from "next/server";
import { calculateInes } from "@/lib/ines/calculateInes";

function formatValue(value: number, type: "peso" | "lunghezza" | "cc"): string {
  if (type === "peso") {
    return Math.round(value).toString();
  }
  const rounded = Math.round(value * 10) / 10;
  const str = rounded.toString();
  if (str.includes(".")) {
    const [int, dec] = str.split(".");
    return dec === "0" ? int : str;
  }
  return str;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      sesso,
      primogenito,
      egWeeks,
      egDays,
      peso,
      pesoDisplay,
      lunghezza,
      lunghezzaDisplay,
      cc,
      ccDisplay,
    } = body;

    const pesoResult =
      peso !== null && peso !== undefined
        ? await calculateInes({
            measure: "peso",
            egWeeks,
            egDays,
            sesso,
            primogenito,
            value: peso,
          })
        : null;

    const lunghezzaResult =
      lunghezza !== null && lunghezza !== undefined
        ? await calculateInes({
            measure: "lunghezza",
            egWeeks,
            egDays,
            sesso,
            primogenito,
            value: lunghezza,
          })
        : null;

    const ccResult =
      cc !== null && cc !== undefined
        ? await calculateInes ({
            measure: "cc",
            egWeeks,
            egDays,
            sesso,
            primogenito,
            value: cc,
          })
        : null;

    if (pesoResult) pesoResult.displayValue = pesoDisplay || formatValue(peso, "peso");
    if (lunghezzaResult) lunghezzaResult.displayValue = lunghezzaDisplay || formatValue(lunghezza, "lunghezza");
    if (ccResult) ccResult.displayValue = ccDisplay || formatValue(cc, "cc");

    return NextResponse.json({
      peso: pesoResult,
      lunghezza: lunghezzaResult,
      cc: ccResult,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Errore calcolo" }, { status: 500 });
  }
}