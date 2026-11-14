import { NextResponse } from 'next/server';

let clothes: any[] = [];

export async function GET() {
  return NextResponse.json({ success: true, data: clothes });
}

export async function POST(req: Request) {
  const body = await req.json();
  const newItem = { id: Date.now(), ...body };
  clothes.push(newItem);
  return NextResponse.json({ success: true, data: newItem });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  clothes = clothes.filter((c: any) => String(c.id) !== String(id));
  return NextResponse.json({ success: true });
}