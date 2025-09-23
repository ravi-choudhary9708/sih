// app/api/me/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Patient from "@/models/Patient";
import { connectDB } from "@/lib/mongoose";

export async function GET(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const patient = await Patient.findById(decoded.id).lean();
    if (!patient) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ patient });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
