import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === "admin@styra.com" && password === "admin123") {
    return NextResponse.json({ success: true, token: "admin-token-123", name: "Admin" });
  }

  return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
}