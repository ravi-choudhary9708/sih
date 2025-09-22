import { NextResponse } from "next/server";

// Call WHO ICD-11 API
export async function GET() {
  try {
    // Example: search TM2 terms for "diabetes"
    const url = "https://id.who.int/icd/entity/search?q=diabetes&linearization=tm2";
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`WHO API error: ${res.status}`);
    }

    const data = await res.json();

    // Simplify response (WHO returns deep JSON-LD)
    const results = (data.destinationEntities || []).map((item) => ({
      id: item.id,
      title: item.title?.["@value"] || "No Title",
    }));

    return NextResponse.json({
      message: `✅ Synced ${results.length} ICD-11 TM2 codes for 'diabetes'`,
      sample: results.slice(0, 5), // show first 5
    });
  } catch (err) {
    console.error("WHO ICD API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
