import { redirect, type Handle } from "@sveltejs/kit";

// Paths (and their sub-paths) that don't require a session.
const PUBLIC_PATHS = ["/login", "/register", "/signup", "/forgot", "/reset", "/offline", "/home"];

const ASSET_PREFIXES = ["/_app", "/service-worker.js", "/manifest.webmanifest", "/favicon"];

function isPublic(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export const handle: Handle = async ({ event, resolve }) => {
  const { pathname } = event.url;

  if (ASSET_PREFIXES.some((p) => pathname.startsWith(p)) || isPublic(pathname)) {
    return resolve(event);
  }

  // This only checks that a token is present, not that it's valid — the actual JWT
  // signature is verified server-side by the API on every request via authMiddleware.
  // This guard exists purely to avoid rendering protected pages (and the failed API
  // calls that would follow) for a client with no session at all.
  const token = event.cookies.get("bound-token");
  if (!token) {
    throw redirect(303, `/login?redirectTo=${encodeURIComponent(pathname)}`);
  }

  return resolve(event);
};
