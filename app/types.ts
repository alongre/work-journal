import { z } from 'zod';

export const EntrySchema = z.object({
	id: z.number(),
	date: z.string(),
	type: z.enum(['work', 'learning', 'other']),
	text: z.string(),
});

export const EntryActionSchema = EntrySchema.omit({ id: true });

export const EntryLoaderSchema = z.array(EntrySchema);

export type Entry = z.infer<typeof EntrySchema>;
