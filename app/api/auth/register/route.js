import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Patient from "@/models/Patient";
import { connectDB } from "@/lib/mongoose";

export async function POST(req) {
  try {
    const { abhaId, password, role,name, gender, birthDate, phone, email, address } = await req.json();
    await connectDB();

    const existing = await Patient.findOne({ abhaId });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
     // Create new patient
    const patient = new Patient({
      abhaId,
      name,
      gender,
      birthDate,
      identifier: abhaId,
      contact: { phone, email },
      address,
      password:hashed,
      role
    });

    await patient.save();

     return NextResponse.json({ message: "Patient registered ✅", patient });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
