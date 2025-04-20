import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('en', () => import('../locales/en.json'));
register('es', () => import('../locales/es.json'));
register('fr', () => import('../locales/fr.json'));
register('de', () => import('../locales/de.json'));
register('pt', () => import('../locales/pt.json'));
register('ru', () => import('../locales/ru.json'));
register('zh', () => import('../locales/zh.json'));
register('ja', () => import('../locales/ja.json'));

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
});
