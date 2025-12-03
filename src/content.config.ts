import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

const slidesSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	session: z.number(),
	theme: z.string().default('black'),
});

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	slides: defineCollection({
		loader: glob({ pattern: '**/*.md', base: './src/content/slides' }),
		schema: slidesSchema,
	}),
};
