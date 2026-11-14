import { NextResponse } from 'next/server';
let data: any[] = [];
export async function GET() { return NextResponse.json({ success: true, data }); }
export async function POST(req: Request) { const body = await req.json(); const item = { id: Date.now(), ...body }; data.push(item); return NextResponse.json({ success: true, data: item }); }
export async function DELETE(req: Request) { const id = new URL(req.url).searchParams.get("id"); data = data.filter((d:any)=>String(d.id)!==String(id)); return NextResponse.json({ success: true }); }