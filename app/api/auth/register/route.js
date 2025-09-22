import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User.js";
import { connectDB } from "@/lib/mongoose";

export async function POST(req) {
  try {
    const { abhaId, password, role } = await req.json();
    await connectDB();

    const existing = await User.findOne({ abhaId });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ abhaId, password: hashed, role });
    await user.save();

    return NextResponse.json({ message: "User registered ✅" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
