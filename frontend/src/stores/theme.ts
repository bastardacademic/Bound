import { writable } from "svelte/store";

export const theme = writable<"dark" | "light">("dark");

if (typeof window !== "undefined") {
  const saved = localStorage.getItem("bound-theme");
  if (saved === "light") theme.set("light");

  theme.subscribe(val => {
    document.documentElement.setAttribute("data-theme", val);
    localStorage.setItem("bound-theme", val);
  });
}
