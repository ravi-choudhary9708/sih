import { getICDAccessToken } from "./token";

export async function searchICD(term, linearization = "mms") {
  try {
    const token = await getICDAccessToken();

    const url = `https://id.who.int/icd/entity/search?q=${encodeURIComponent(
      term
    )}&linearization=${linearization}&flatResults=true&highlightingEnabled=false`;

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "API-Version": "v2",
        "Accept-Language": "en",   // ✅ force English results
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("WHO ICD API error:", res.status, term, text);
      return [];
    }

    const data = await res.json();

    return (data.destinationEntities || []).map((d) => ({
      code: d.id,
      display: d.title?.["@value"] || d.title,
      system: `ICD11-${linearization.toUpperCase()}`,
    }));
  } catch (err) {
    console.error("WHO ICD API exception:", err);
    return [];
  }
}
