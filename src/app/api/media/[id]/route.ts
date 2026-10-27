import { readMediaBytes } from "@/cms/media";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params;
  const file = await readMediaBytes(id);
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(Buffer.from(file.bytes), {
    headers: {
      "content-type": file.mime,
      "content-disposition": `inline; filename="${file.filename.replace(/"/g, "")}"`,
      "cache-control": "public, max-age=86400",
    },
  });
}
