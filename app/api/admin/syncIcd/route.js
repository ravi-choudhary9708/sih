import { NextResponse } from "next/server";
import { getICDAccessToken } from "@/utils/token";

// Extract English title from ICD entity
function extractTitle(item) {
  if (!item) return "No Title";

  if (item.title?.["@value"]) return item.title["@value"];

  if (item.titleMap && Array.isArray(item.titleMap)) {
    const en = item.titleMap.find((t) => t.lang === "en");
    if (en) return en["@value"];
  }

  if (item.prefLabel && Array.isArray(item.prefLabel)) {
    const en = item.prefLabel.find((t) => t.lang === "en");
    if (en) return en["@value"];
  }

  return "No Title";
}

// WHO ICD-11 Search API with fuzzy matching
async function searchICD(term, retries = 2) {
  const accessToken = await getICDAccessToken();
  const urlBase = "https://id.who.int/icd/entity/search";

  // Try multiple variations to match NAMASTE terms
  const queries = [term, `${term} Ayurveda`, `${term} Dosha`, `${term} Unani`];

  for (let q of queries) {
    try {
      const url = `${urlBase}?q=${encodeURIComponent(q)}&linearization=tm2`;
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "API-Version": "v2",
          "Accept-Language": "en",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.warn(`WHO ICD search failed for "${q}":`, res.status, text);
        continue;
      }

      const data = await res.json();
      if (data.destinationEntities?.length) {
        return data.destinationEntities.map((item) => ({
          id: item.id.replace("http://", "https://"),
          title: extractTitle(item),
        }));
      }
    } catch (err) {
      console.error("WHO ICD fetch error:", q, err);
      if (retries > 0) return searchICD(term, retries - 1);
    }
  }

  return []; // return empty array if all queries fail
}

// GET /api/admin/syncIcd?q=term
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const term = searchParams.get("q") || "diabetes";

    const results = await searchICD(term);

    console.log("result",results)

    return NextResponse.json({
      message: `✅ Synced ${results.length} ICD-11 TM2 codes for '${term}'`,
      sample: results.slice(0, 5),
    });
  } catch (err) {
    console.error("WHO ICD API handler error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
