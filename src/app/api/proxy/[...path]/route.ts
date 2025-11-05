import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params; // ⬅️ توجه: باید await شود!
  const targetUrl = `${BASE_URL}/${path.join("/")}${req.nextUrl.search}`;

  const res = await fetch(targetUrl, {
    headers: { ...Object.fromEntries(req.headers) },
  });

  const data = await res.text();
  return new NextResponse(data, { status: res.status });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params; // ⬅️ await اجباری است
  const targetUrl = `${BASE_URL}/${path.join("/")}`;

  const body = await req.text();

  const res = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": req.headers.get("content-type") || "application/json",
    },
    body,
  });

  const data = await res.text();
  return new NextResponse(data, { status: res.status });
}
