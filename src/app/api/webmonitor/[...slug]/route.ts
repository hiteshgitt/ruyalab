// Web Monitor endpoint. Next.js version is read from this app's own package so Cloudflare
// Workers still report it when node_modules is not on the runtime filesystem.
import { GET as monitorGet } from '@ruyalab/webmonitor-nextjs/app-router';
import nextPackage from 'next/package.json';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const VERSION_ENDPOINTS = new Set(['health', 'security', 'libraries']);

export async function GET(request: Request) {
  const response = await monitorGet(request);
  const endpoint = new URL(request.url).pathname.split('/').filter(Boolean).pop() || '';
  if (response.status !== 200 || !VERSION_ENDPOINTS.has(endpoint) || !nextPackage.version) return response;
  const body = await response.json();
  if (!body || typeof body !== 'object' || body.nextjs_version) {
    return Response.json(body, { status: response.status, headers: { 'Cache-Control': 'no-store' } });
  }
  return Response.json(
    { ...body, nextjs_version: nextPackage.version },
    { status: response.status, headers: { 'Cache-Control': 'no-store' } },
  );
}
