// stores/groups.ts
import { writable } from "svelte/store";

export const mutedGroups = writable<string[]>([]);
export const blockedGroups = writable<string[]>([]);

export function toggleMuteGroup(id: string) {
  mutedGroups.update(groups =>
    groups.includes(id) ? groups.filter(g => g !== id) : [...groups, id]
  );
}

export function toggleBlockGroup(id: string) {
  blockedGroups.update(groups =>
    groups.includes(id) ? groups.filter(g => g !== id) : [...groups, id]
  );
}
