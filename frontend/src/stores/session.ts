import { writable } from "svelte/store";

export type Session = {
  token: string | null;
  user: Record<string, unknown> | null;
};

const empty: Session = { token: null, user: null };

function loadInitial(): Session {
  if (typeof window === "undefined") return empty;
  const saved = localStorage.getItem("bound-session");
  if (!saved) return empty;
  try {
    return JSON.parse(saved) as Session;
  } catch {
    return empty;
  }
}

export const session = writable<Session>(loadInitial());

export function logout() {
  session.set(empty);
}

if (typeof window !== "undefined") {
  session.subscribe((val) => {
    if (val.token) {
      localStorage.setItem("bound-session", JSON.stringify(val));
      // Mirrored into a cookie so hooks.server.ts can see login state during SSR/navigation —
      // the token itself lives in localStorage; this is only a presence check for redirects.
      document.cookie = `bound-token=${val.token}; path=/; max-age=604800; samesite=lax`;
    } else {
      localStorage.removeItem("bound-session");
      document.cookie = "bound-token=; path=/; max-age=0; samesite=lax";
    }
  });
}
