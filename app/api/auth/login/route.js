import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Patient from "@/models/Patient";
import { connectDB } from "@/lib/mongoose";

export async function POST(req) {
  try {
    const { abhaId, password } = await req.json();
    await connectDB();

    const user = await Patient.findOne({ abhaId });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

    const token = jwt.sign(
      { id: user._id, abhaId: user.abhaId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = NextResponse.json({ message: "Login successful ✅" });
    res.cookies.set("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
    return res;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
