import { NextRequest, NextResponse } from "next/server";
import { calculateWhoPercentile, interpretPercentile } from "@/lib/who/calculateWho";

function withInterpretation(result: any) {
  if (!result) return null;
  return {
    ...result,
    interpretation: interpretPercentile(result.percentile),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { sex, month, weight, length, head } = body;

    const weightResult =
      weight !== null && weight !== undefined
        ? await calculateWhoPercentile({
            sex,
            measure: "weight",
            x: month,
            value: weight,
          })
        : null;

    const lengthResult =
      length !== null && length !== undefined
        ? await calculateWhoPercentile({
            sex,
            measure: "length",
            x: month,
            value: length,
          })
        : null;

    const headResult =
      head !== null && head !== undefined
        ? await calculateWhoPercentile({
            sex,
            measure: "head",
            x: month,
            value: head,
          })
        : null;

    const weightForLengthResult =
      weight !== null &&
      weight !== undefined &&
      length !== null &&
      length !== undefined
        ? await calculateWhoPercentile({
            sex,
            measure: "weightForLength",
            x: length,
            value: weight,
          })
        : null;

    return NextResponse.json({
      weight: withInterpretation(weightResult),
      length: withInterpretation(lengthResult),
      head: withInterpretation(headResult),
      weightForLength: withInterpretation(weightForLengthResult),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Errore calcolo" }, { status: 500 });
  }
}