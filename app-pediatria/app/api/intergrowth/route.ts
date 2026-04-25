import { NextRequest, NextResponse } from "next/server";
import { calculateIntergrowth } from "@/lib/intergrowth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { sex, egWeeks, egDays, weight } = body;

    // Validazione input
    if (!sex || sex !== "M" && sex !== "F") {
      return NextResponse.json(
        { error: "Sesso non valido (M o F)" },
        { status: 400 }
      );
    }

    if (typeof egWeeks !== "number" || typeof egDays !== "number") {
      return NextResponse.json(
        { error: "Età gestazionale non valida" },
        { status: 400 }
      );
    }

    if (typeof weight !== "number" || weight <= 0) {
      return NextResponse.json(
        { error: "Peso non valido" },
        { status: 400 }
      );
    }

    // Converte il peso da grammi a kg per il calcolo LMS
    const weightKg = weight / 1000;

    const result = await calculateIntergrowth({
      egWeeks,
      egDays,
      sex,
      value: weightKg,
    });

    // Ritorna il peso originale in grammi, ma con zScore e percentile calcolati
    return NextResponse.json({ 
      result: {
        ...result,
        value: weight, // Ritorna il peso originale in grammi
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore sconosciuto";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
