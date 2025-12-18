import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Workshops (parent collection)
const workshopsCollection = defineCollection({
	loader: glob({ pattern: '*.{md,mdx}', base: './src/content/workshops' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		topics: z.array(z.string()).default([]),
		dates: z.string().optional(),
		time: z.string().optional(),
		draft: z.boolean().default(false),
	}),
});

// Workshop sessions (child collection)
const sessionsCollection = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/sessions' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		workshop: z.string(), // References parent workshop slug
		order: z.number(), // Session order within workshop
		date: z.coerce.date(),
		duration: z.string().optional(),
		slidesUrl: z.string().optional(),
		draft: z.boolean().default(false),
	}),
});

// Blog posts
const blogCollection = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		updated: z.coerce.date().optional(),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
	}),
});

// Prompt library
const libraryCollection = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/library' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		category: z.enum(['coding', 'review', 'debug', 'writing', 'analysis', 'other']),
		tags: z.array(z.string()).default([]),
		prompt: z.string(), // The actual prompt text
	}),
});

export const collections = {
	workshops: workshopsCollection,
	sessions: sessionsCollection,
	blog: blogCollection,
	library: libraryCollection,
};
