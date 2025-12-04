import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, number, name, expiry, cvv } = await req.json();
    if (!amount || amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    if (!number || !name || !expiry || !cvv) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const requires_action = String(number).endsWith("2");
    return NextResponse.json({ success: !requires_action, requires_action });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

