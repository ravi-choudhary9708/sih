import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  console.log("token:",token)
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    console.log("err",err)
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/api/bundle/:path*", "/admin/:path*"] ,
   runtime: "nodejs",// protect bundle + admin
};
