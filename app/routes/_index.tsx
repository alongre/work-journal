import { PrismaClient } from '@prisma/client';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, Link, redirect, useFetcher, useLoaderData } from '@remix-run/react';
import { format, parseISO } from 'date-fns';
import { useEffect, useMemo, useRef } from 'react';
import EntryForm from '~/components/EntryForm';
import { EntryActionSchema, EntryLoaderSchema } from '~/types';

export const meta: MetaFunction = () => {
	return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

//* This is the function that will be called when the user submits the form.
export async function action({ request }: ActionFunctionArgs) {
	const db = new PrismaClient();
	const data = await request.formData();
	await new Promise((resolve) => setTimeout(resolve, 1000));

	try {
		const info = Object.fromEntries(data.entries());
		const formData = EntryActionSchema.parse(info);
		await db.entry.create({
			data: {
				date: new Date(formData.date),
				type: formData.type,
				text: formData.text,
			},
		});

		return redirect('/');
	} catch (e) {
		console.log(e);
		return redirect('/');
	}
}

const getFormatDate = (date: Date): string => {
	return date.toString().substring(0, 10);
};

//* This is the function that will be called when the page is loaded or refreshed.
export async function loader() {
	const db = new PrismaClient();
	const entries = await db.entry.findMany({
		orderBy: { date: 'desc' },
	});

	// const entriesData = EntryLoaderSchema.parse(entries);
	return entries.map((entry) => ({
		...entry,
		date: format(entry.date, 'yyyy-MM-dd'),
	}));
}

export default function Index() {
	const fetcher = useFetcher();
	let textAreaRef = useRef<HTMLTextAreaElement>(null);
	const entries = useLoaderData<typeof loader>();
	// const entriesData = EntryLoaderSchema.parse(entries);

	const entriesByDate = useMemo(() => {
		const weeks = entries.reduce<Record<string, typeof entries>>((acc, entry) => {
			const key = entry.date;
			acc[key] ||= [];

			acc[key].push({
				...entry,
				date: entry.date,
			});

			return acc;
		}, {});

		return Object.keys(weeks)
			.sort((a, b) => a.localeCompare(b))
			.map((date) => ({
				date,
				work: weeks[date].filter((entry) => entry.type === 'work'),
				learning: weeks[date].filter((entry) => entry.type === 'learning'),
				other: weeks[date].filter((entry) => entry.type === 'other'),
			}));
	}, [entries]);

	useEffect(() => {
		if (fetcher.state === 'idle' && textAreaRef.current) {
			textAreaRef.current.value = '';
			textAreaRef.current.focus();
		}
	}, [fetcher.state]);

	return (
		<div className='mx-auto max-w-7xl p-6'>
			<h1 className='text-4xl text-white'>Work journal</h1>
			<p className='mt-3 text-xl text-gray-400'>Doings and learnings. Updated weekly.</p>

			<div className='my-8 border p-3'>
				<EntryForm />
			</div>
			<div className='mt-6 space-y-6'>
				{entriesByDate.map((entry) => (
					<div key={entry.date}>
						<p className='font-bold'>Week of {format(parseISO(entry.date), 'MMM do')}</p>

						<div className='mt-3 space-y-4'>
							{entry.work.length > 0 && (
								<div>
									<p>Work</p>
									<ul className='list-disc ml-8'>
										{entry.work.map((e) => (
											<EntryListItem key={e.id} entry={e} />
										))}
									</ul>
								</div>
							)}
						</div>

						<div className='mt-3 space-y-4'>
							{entry.learning.length > 0 && (
								<div>
									<p>Learning</p>
									<ul className='list-disc ml-8'>
										{entry.learning.map((e) => (
											<EntryListItem key={e.id} entry={e} />
										))}
									</ul>
								</div>
							)}
						</div>

						<div className='mt-3 space-y-4'>
							{entry.other.length > 0 && (
								<div>
									<p>Other</p>
									<ul className='list-disc ml-8'>
										{entry.other.map((e) => (
											<EntryListItem key={e.id} entry={e} />
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

const EntryListItem = ({ entry }: { entry: Awaited<ReturnType<typeof loader>>[number] }) => {
	return (
		<li className='group'>
			{entry.text}
			<Link to={`/entries/${entry.id}/edit`} className='ml-2 text-blue-500 opacity-0 group-hover:opacity-100'>
				Edit
			</Link>

			<Form method='post' className='inline-block' action={`/entries/${entry.id}/delete`}>
				<button className='ml-2 text-blue-500 opacity-0 group-hover:opacity-100'>
					<svg
						className='w-[12px] h-[12px] text-gray-800 dark:text-white'
						aria-hidden='true'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 18 20'
					>
						<path
							stroke='currentColor'
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z'
						/>
					</svg>
				</button>
			</Form>
		</li>
	);
};
