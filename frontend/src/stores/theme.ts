import { writable } from 'svelte/store';

const stored = typeof localStorage !== 'undefined' && localStorage.getItem('theme');
export const theme = writable(stored || 'light');

theme.subscribe((value) => {
  if (typeof document !== 'undefined') {
    document.documentElement.className = value === 'dark' ? 'theme-dark' : 'theme-light';
    localStorage.setItem('theme', value);
  }
});
