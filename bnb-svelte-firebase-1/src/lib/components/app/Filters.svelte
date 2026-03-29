<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { SlidersHorizontalIcon } from 'lucide-svelte';

	const url = $page.url;

	let filters = [
		{
			label: 'All',
			icon: '🌍',
			key: 'all'
		},
		{
			label: 'Hotel',
			icon: '🏨',
			key: 'hotel'
		},
		{
			label: 'Villa',
			icon: '🏡',
			key: 'villa'
		},
		{
			label: 'Apartment',
			icon: '🏢',
			key: 'apartment'
		},
		{
			label: 'Resort',
			icon: '🌴',
			key: 'resort'
		},
		{
			label: 'Beach',
			icon: '🏖️',
			key: 'beach'
		}
	];
</script>

<div class="flex items-center justify-between gap-8">
	<div class="flex items-center gap-4 overflow-hidden overflow-x-auto">
		{#each filters as filter (filter.key)}
			<button
				on:click={() => {
					let query = new URLSearchParams(url.searchParams.toString());
					query.set('filter-by', filter.key);
					goto(`?${query.toString()}`);
				}}
				class={cn(
					`group flex flex-col items-center gap-2 p-4 opacity-70 transition hover:opacity-100 active:scale-90`,
					$page.url.searchParams.get('filter-by') == filter.key && 'opacity-100'
				)}
			>
				<span class="text-2xl">{filter.icon}</span>
				<span
					class={cn(
						'border-b-2 border-b-transparent pb-2 text-sm font-semibold transition group-hover:border-b-black/60',
						$page.url.searchParams.get('filter-by') == filter.key && 'border-b-black'
					)}
				>
					{filter.label}
				</span>
			</button>
		{/each}
	</div>
	<Button variant="outline" size="lg">
		<SlidersHorizontalIcon class="mr-2 h-4 w-4" />
		Filters
	</Button>
</div>
