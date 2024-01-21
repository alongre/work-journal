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

export default function EntryForm(props: { entry?: Entry }) {
	const fetcher = useFetcher();
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	// const hasSubmitted = fetcher.state === 'idle' && isNewEntry;

	useEffect(() => {
		if (fetcher.state === 'idle' && textAreaRef.current && props.entry === undefined) {
			textAreaRef.current.value = '';
			textAreaRef.current.focus();
		}
	}, [fetcher.state, props.entry]);

	return (
		<fetcher.Form method='post'>
			<fieldset disabled={fetcher.state !== 'idle'} className='disabled:opacity-60'>
				<div className='border p-3'>
					<div className='italic'>{props.entry === undefined ? 'Create an Entry' : `Edit Entry ${props.entry.id}`}</div>
					<div className='py-4'>
						<input
							type='date'
							name='date'
							className='text-gray-700'
							required
							defaultValue={
								props.entry !== undefined
									? format(new Date(props.entry.date), 'yyyy-MM-dd')
									: format(new Date(), 'yyyy-MM-dd')
							}
							// defaultValue={format(new Date(), 'yyyy-MM-dd')}
						/>
					</div>
					<div className='mt-2 space-x-6'>
						{WORK_OPTIONS.map((option, index) => (
							<label key={option.value} className='mr-4'>
								<input
									type='radio'
									required
									defaultChecked={props.entry === undefined ? index === 0 : props.entry.type === option.value}
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
							defaultValue={props.entry === undefined ? '' : props.entry.text}
							className='w-full text-gray-900'
							placeholder='Add your entry...'
						/>
					</div>
					<div className='mt-4 text-right'>
						<button type='submit' className='bg-blue-500 rounded-md text-white px-4 py-2'>
							{fetcher.state !== 'idle' ? 'Adding...' : props.entry === undefined ? 'Add' : 'Update'}
						</button>
					</div>
				</div>
			</fieldset>
		</fetcher.Form>
	);
}
