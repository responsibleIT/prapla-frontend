import {sveltekit} from '@sveltejs/kit/vite';
import {SvelteKitPWA} from '@vite-pwa/sveltekit'

import {defineConfig} from 'vite';
import {vitePreprocess} from '@sveltejs/kit/vite';

export default defineConfig({
    plugins: [sveltekit(),
        SvelteKitPWA()],
    preprocess: [vitePreprocess()]
});