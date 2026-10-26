import { NextResponse } from "next/server";
import { deliverContact } from "@/components/contact/deliver";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] ?? ch);
}

export async function POST(req: Request) {
  const form = await req.formData();
  const result = await deliverContact(form);
  const accept = req.headers.get("accept") ?? "";

  if (accept.includes("text/html")) {
    if (result.status === "success") return NextResponse.redirect(new URL("/thanks", req.url), 303);
    const message = escapeHtml(result.message ?? "Please check the form and try again.");
    return new Response(
      `<!doctype html><html lang="en"><meta charset="utf-8"><title>Check the form — Ruyalab</title><body style="font-family:sans-serif;padding:2rem"><p>${message}</p><p><a href="/#contact">Back to the form</a></p></body></html>`,
      { status: 422, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }

  return NextResponse.json(result, { status: result.status === "success" ? 200 : 422 });
}
