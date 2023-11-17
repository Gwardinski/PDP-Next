import isValidURL from "@/utils/isValidUrl";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const contentType = await req.headers.get("content-type");
  if (contentType !== "application/json") {
    return NextResponse.json({ error: "Invalid Request" }, { status: 415 });
  }

  const data = await req.json();
  const url = data && data.url ? data.url : null;
  if (!url) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const validUrl = await isValidURL(url, []);
  if (!validUrl) {
    return NextResponse.json({ error: "Bad Url" }, { status: 400 });
  }

  return NextResponse.json({ hello: "ayyyyyy" });
}
