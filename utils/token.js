// utils/token.js
export async function getICDAccessToken() {
  const clientId = process.env.WHO_ICD_CLIENT_ID;
  const clientSecret = process.env.WHO_ICD_CLIENT_SECRET;

  const tokenUrl = "https://icdaccessmanagement.who.int/connect/token"; // Correct token endpoint

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("scope", "icdapi_access"); // required scope

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: params.toString(),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error("Token request failed:", res.status, text);
    throw new Error(`Token request failed: ${res.status} - ${text}`);
  }

  const data = JSON.parse(text);
  return data.access_token;
}
