import { NextRequest, NextResponse } from "next/server";
import { calculateInesPercentile } from "@/lib/ines/calculateInes";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { sesso, primogenito, eg, peso, lunghezza, cc } = body;

    const pesoResult =
      peso !== null && peso !== undefined
        ? await calculateInesPercentile({
            measure: "peso",
            eg,
            sesso,
            primogenito,
            value: peso,
          })
        : null;

    const lunghezzaResult =
      lunghezza !== null && lunghezza !== undefined
        ? await calculateInesPercentile({
            measure: "lunghezza",
            eg,
            sesso,
            primogenito,
            value: lunghezza,
          })
        : null;

    const ccResult =
      cc !== null && cc !== undefined
        ? await calculateInesPercentile({
            measure: "cc",
            eg,
            sesso,
            primogenito,
            value: cc,
          })
        : null;

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
