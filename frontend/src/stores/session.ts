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

if (typeof window !== "undefined") {
  session.subscribe((val) => {
    if (val.token) {
      localStorage.setItem("bound-session", JSON.stringify(val));
    } else {
      localStorage.removeItem("bound-session");
    }
  });
}
