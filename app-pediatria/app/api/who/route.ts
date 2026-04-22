import { NextRequest, NextResponse } from "next/server";
import { calculateWhoPercentile } from "@/lib/who/calculateWho";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { sex, month, weight, length, head } = body;

    const weightResult = await calculateWhoPercentile({
      sex,
      measure: "weight",
      month,
      value: weight,
    });

    const lengthResult = await calculateWhoPercentile({
      sex,
      measure: "length",
      month,
      value: length,
    });

    const headResult = await calculateWhoPercentile({
      sex,
      measure: "head",
      month,
      value: head,
    });

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