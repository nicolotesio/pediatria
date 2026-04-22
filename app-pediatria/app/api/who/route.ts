import { NextRequest, NextResponse } from "next/server";
import { calculateWhoPercentile } from "@/lib/who/calculateWho";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { sex, month, weight, length, head } = body;

    const weightResult =
      weight !== null && weight !== undefined
        ? await calculateWhoPercentile({
            sex,
            measure: "weight",
            month,
            value: weight,
          })
        : null;

    const lengthResult =
      length !== null && length !== undefined
        ? await calculateWhoPercentile({
            sex,
            measure: "length",
            month,
            value: length,
          })
        : null;

    const headResult =
      head !== null && head !== undefined
        ? await calculateWhoPercentile({
            sex,
            measure: "head",
            month,
            value: head,
          })
        : null;

    return NextResponse.json({
      weight: weightResult,
      length: lengthResult,
      head: headResult,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Errore calcolo" }, { status: 500 });
  }
}