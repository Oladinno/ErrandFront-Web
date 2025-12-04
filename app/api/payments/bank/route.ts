import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, accountNumber, routingNumber, name } = await req.json();
    if (!amount || amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    if (!accountNumber || !routingNumber || !name) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    if (!/^\d{10,14}$/.test(String(accountNumber))) return NextResponse.json({ error: "Invalid account number" }, { status: 400 });
    if (!/^\d{9}$/.test(String(routingNumber))) return NextResponse.json({ error: "Invalid routing number" }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

