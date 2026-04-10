import adapter from '@sveltejs/adapter-node';
import { resolve } from 'path';
const config = { kit: { adapter: adapter(), alias: { '$stores': resolve('src/stores'), '$lib': resolve('src/lib') } } };
export default config;