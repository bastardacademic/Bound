// stores/ui.ts
import { writable } from "svelte/store";

type UISettings = {
  theme: "dark" | "light";
  contrast: "normal" | "high";
  textSize: "normal" | "large";
  haptics: boolean;
};

const defaultSettings: UISettings = {
  theme: "dark",
  contrast: "normal",
  textSize: "normal",
  haptics: true,
};

export const uiSettings = writable<UISettings>(
  JSON.parse(localStorage.getItem("uiSettings") || "null") || defaultSettings
);

uiSettings.subscribe(value => {
  localStorage.setItem("uiSettings", JSON.stringify(value));
  document.body.dataset.theme = value.theme;
  document.body.dataset.contrast = value.contrast;
  document.body.dataset.textSize = value.textSize;
});
