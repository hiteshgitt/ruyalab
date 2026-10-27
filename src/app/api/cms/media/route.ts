import { NextResponse } from "next/server";
import { isCmsAuthed } from "@/cms/auth";
import { listMedia, uploadMedia } from "@/cms/media";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isCmsAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ items: await listMedia() });
}

export async function POST(req: Request) {
  if (!(await isCmsAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose a file to upload." }, { status: 400 });
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const asset = await uploadMedia({
      filename: file.name || "upload",
      mime: file.type || "application/octet-stream",
      bytes,
      alt: String(form.get("alt") || ""),
    });
    return NextResponse.json({ item: asset });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed." },
      { status: 400 },
    );
  }
}
