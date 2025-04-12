import { writable } from "svelte/store";

type Prefs = {
  font: "sans" | "serif";
  contrast: boolean;
  textSize: "small" | "normal" | "large";
};

const defaultPrefs: Prefs = {
  font: "sans",
  contrast: false,
  textSize: "normal"
};

export const accessibility = writable<Prefs>(defaultPrefs);

if (typeof window !== "undefined") {
  const saved = localStorage.getItem("accessibility");
  if (saved) accessibility.set(JSON.parse(saved));

  accessibility.subscribe(prefs => {
    const html = document.documentElement;
    const body = document.body;

    body.classList.toggle("font-serif", prefs.font === "serif");
    body.classList.toggle("font-sans", prefs.font === "sans");

    body.classList.remove("text-sm", "text-md", "text-lg");
    if (prefs.textSize === "small") body.classList.add("text-sm");
    else if (prefs.textSize === "large") body.classList.add("text-lg");
    else body.classList.add("text-md");

    if (prefs.contrast) {
      html.setAttribute("data-contrast", "high");
    } else {
      html.removeAttribute("data-contrast");
    }

    localStorage.setItem("accessibility", JSON.stringify(prefs));
  });
}
