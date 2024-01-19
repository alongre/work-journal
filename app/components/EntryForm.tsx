import { useFetcher } from '@remix-run/react';
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';
import { Entry } from '../types';

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

export default function EntryForm(entry?: Entry) {
	const fetcher = useFetcher();
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const isNewEntry = entry === undefined;

	const hasSubmitted = fetcher.state === 'idle' && isNewEntry;

	useEffect(() => {
		if (fetcher.state === 'idle' && textAreaRef.current) {
			textAreaRef.current.value = '';
			textAreaRef.current.focus();
		}
	}, [fetcher.state]);

	return (
		<fetcher.Form method='post'>
			<fieldset disabled={fetcher.state !== 'idle'} className='disabled:opacity-60'>
				<div className='italic'>{isNewEntry ? 'Create an Entry' : 'Edit Entry'}</div>
				<div className='py-4'>
					<input
						type='date'
						name='date'
						className='text-gray-700'
						required
						defaultValue={format(new Date(), 'yyyy-MM-dd')}
					/>
				</div>
				<div className='mt-2 space-x-6'>
					{WORK_OPTIONS.map((option, index) => (
						<label key={option.value} className='mr-4'>
							<input
								type='radio'
								required
								defaultChecked={index === 0}
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
