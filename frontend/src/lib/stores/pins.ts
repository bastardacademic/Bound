// stores/pins.ts
import { writable } from "svelte/store";

type PinnedItem = {
  type: "journal" | "media";
  id: string;
};

const defaultPins: PinnedItem[] = [];

export const pinnedItems = writable<PinnedItem[]>(defaultPins);

export function togglePin(type: "journal" | "media", id: string) {
  pinnedItems.update(items => {
    const existing = items.find(p => p.type === type);
    if (existing?.id === id) {
      return items.filter(p => p.id !== id); // unpin
    } else {
      const withoutSameType = items.filter(p => p.type !== type);
      return [...withoutSameType, { type, id }];
    }
  });
}
