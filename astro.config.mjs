// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeNext from 'starlight-theme-next';

// https://astro.build/config
export default defineConfig({
	site: 'https://hola-ai.dev',
	integrations: [
		starlight({
			plugins: [starlightThemeNext()],
			title: 'Hola AI',
			description: 'Coding Workshop-Serie: KI-Tools im Coding-Alltag',
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'Deutsch',
					lang: 'de',
				},
			},
			sidebar: [
				{
					label: 'Guides',
					items: [
						{ label: 'Setup', slug: 'guides/setup' },
					],
				},
				{
					label: 'Sessions',
					items: [
						{ label: 'Session 1 (05.12)', slug: 'workshop/session-1' },
						{ label: 'Session 2 (12.12)', slug: 'workshop/session-2', badge: { text: 'Soon', variant: 'caution' } },
						{ label: 'Session 3 (19.12)', slug: 'workshop/session-3', badge: { text: 'Soon', variant: 'caution' } },
					],
				},
			],
			customCss: ['./src/styles/custom.css'],
		}),
	],
});
