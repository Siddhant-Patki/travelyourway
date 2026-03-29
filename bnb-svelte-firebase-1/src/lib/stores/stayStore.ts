import { writable } from 'svelte/store';
import { CalendarDate, type DateValue } from '@internationalized/date';
import type { DateRange } from 'bits-ui';

const today = new Date();

export const duration = writable<DateRange>({
	start: new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()),
	end: new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()).add({ days: 1 })
});

export function setRange(range: DateRange) {
	duration.set(range);
}
