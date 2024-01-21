import { PrismaClient } from '@prisma/client';
import { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { format } from 'date-fns';
import EntryForm from '~/components/EntryForm';
import { EntryType } from '../types';

export async function loader({ params }: LoaderFunctionArgs) {
	if (typeof params.entryid !== 'string') {
		throw new Response('Not Found', { status: 404 });
	}
	const db = new PrismaClient();
	const entry = await db.entry.findUnique({
		where: { id: Number(params.entryid) },
	});
	if (!entry) {
		throw new Response('Not Found', { status: 404 });
	}
	return {
		...entry,
		date: format(entry.date, 'yyyy-MM-dd'),
	};
}

export default function EditPage() {
	const entry = useLoaderData<typeof loader>();
	return (
		<div className='mt-4'>
			<EntryForm
				entry={{
					date: entry.date,
					id: entry.id,
					text: entry.text,
					type: entry.type as EntryType,
				}}
			/>
		</div>
	);
}
