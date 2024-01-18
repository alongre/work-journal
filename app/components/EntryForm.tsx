import { useFetcher } from '@remix-run/react';
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';
import type { Entry } from '../routes/_index';

const WORK_OPTIONS = [
	{
		value: 'work',
		label: 'Work',
	},
	{
		value: 'learning',
		label: 'Learning',
	},
	{
		value: 'other',
		label: 'Other',
	},
];

export default function EntryForm({
	entry = {
		id: -1,
		date: format(new Date(), 'yyyy-MM-dd'),
		type: 'work',
		text: 'This is a test',
	},
}: {
	entry?: Entry[number];
}) {
	const fetcher = useFetcher();
	let textAreaRef = useRef<HTMLTextAreaElement>(null);
	const isNewEntry = entry.id === -1;

	const hasSubmitted = fetcher.state === 'idle' && fetcher.data !== undefined;

	useEffect(() => {
		if (hasSubmitted && textAreaRef.current) {
			textAreaRef.current.value = '';
			textAreaRef.current.focus();
		}
	}, [hasSubmitted]);

	return (
		<fetcher.Form method='post'>
			<fieldset disabled={fetcher.state !== 'idle'} className='disabled:opacity-60'>
				<div className='italic'>{isNewEntry ? 'Create an Entry' : 'Edit Entry'}</div>
				<div className='py-4'>
					<input type='date' name='date' className='text-gray-700' required defaultValue={entry.date} />
				</div>
				<div className='mt-2 space-x-6'>
					{WORK_OPTIONS.map((option) => (
						<label key={option.value} className='mr-4'>
							<input
								type='radio'
								required
								defaultChecked={entry.type === option.value ?? 'work'}
								name='type'
								value={option.value}
								className='mr-1'
							/>
							{option.label}
						</label>
					))}
				</div>
				<div className='mt-4'>
					<textarea
						ref={textAreaRef}
						name='text'
						required
						defaultValue={isNewEntry ? '' : entry.text}
						className='w-full text-gray-700'
						placeholder='Add your entry...'
					/>
				</div>
				<div className='mt-4 text-right'>
					<button type='submit' className='bg-blue-500 rounded-md text-white px-4 py-2'>
						{fetcher.state !== 'idle' ? 'Saving...' : 'Save'}
					</button>
				</div>
			</fieldset>
		</fetcher.Form>
	);
}
