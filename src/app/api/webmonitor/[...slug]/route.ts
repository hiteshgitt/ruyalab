// Web Monitor endpoint. Cloudflare Workers cannot read this app's files at runtime,
// so Next.js version and direct dependencies are taken from the built package manifests.
import { GET as monitorGet } from '@ruyalab/webmonitor-nextjs/app-router';
import nextPackage from 'next/package.json';
import appPackage from '../../../../../package.json';
import lock from '../../../../../package-lock.json';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const VERSION_ENDPOINTS = new Set(['health', 'security', 'libraries']);

type Deps = Record<string, string>;
type LockFile = { packages?: Record<string, { version?: string }> };

function resolvedVersion(name: string, range: string) {
  const locked = (lock as LockFile).packages?.[`node_modules/${name}`]?.version;
  return locked || range;
}

function librariesFromManifest() {
  const format = (deps: Deps = {}, isDev: boolean) => Object.entries(deps).map(([name, range]) => ({
    name,
    version: resolvedVersion(name, range),
    rawVersion: range,
    isDev,
    type: isDev ? 'devDependency' : 'dependency',
    outdated: null,
  }));
  const dependencies = format(appPackage.dependencies, false);
  const devDependencies = format(appPackage.devDependencies, true);
  return {
    total_libraries: dependencies.length + devDependencies.length,
    dependencies_count: dependencies.length,
    devDependencies_count: devDependencies.length,
    dependencies,
    devDependencies,
    all_libraries: [...dependencies, ...devDependencies],
    outdated_count: null,
    node_version: process.version,
    nextjs_version: nextPackage.version,
  };
}

export async function GET(request: Request) {
  const response = await monitorGet(request);
  const endpoint = new URL(request.url).pathname.split('/').filter(Boolean).pop() || '';
  if (response.status !== 200 || !VERSION_ENDPOINTS.has(endpoint)) return response;
  const body = await response.json();
  if (!body || typeof body !== 'object') return response;

  const listed = Array.isArray(body.all_libraries) ? body.all_libraries.length : 0;
  if (endpoint === 'libraries' && listed === 0) {
    return Response.json(librariesFromManifest(), { status: 200, headers: { 'Cache-Control': 'no-store' } });
  }
  if (body.nextjs_version || !nextPackage.version) {
    return Response.json(body, { status: response.status, headers: { 'Cache-Control': 'no-store' } });
  }
  return Response.json(
    { ...body, nextjs_version: nextPackage.version },
    { status: response.status, headers: { 'Cache-Control': 'no-store' } },
  );
}
