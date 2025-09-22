// src/lib/fhir.js
export function isBundle(obj) {
  return obj && obj.resourceType === "Bundle" && Array.isArray(obj.entry);
}

