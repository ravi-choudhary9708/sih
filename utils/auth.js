// utils/auth.js
import jwt from "jsonwebtoken";

export function getPatientIdFromToken() {
  if (typeof window === "undefined") return null;

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    const decoded = jwt.decode(token);
    return decoded?.id || null;
  } catch {
    return null;
  }
}
