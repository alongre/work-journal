import { z } from 'zod';

export const Type = z.enum(['work', 'learning', 'other']);

export const EntrySchema = z.object({
	id: z.number(),
	date: z.string(),
	type: Type,
	text: z.string(),
});

export const EntryActionSchema = EntrySchema.omit({ id: true });

export const EntryLoaderSchema = z.array(EntrySchema);

export type Entry = z.infer<typeof EntrySchema>;
export type EntryType = z.infer<typeof Type>;
