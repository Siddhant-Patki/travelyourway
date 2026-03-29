<script lang="ts">
	import { collectionStore } from 'sveltefire';
	import { firestore } from '$lib/firebase';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';

	import Filters from '$lib/components/app/Filters.svelte';
	import ListingComponent from '$lib/components/app/Listing.svelte';
	import { type Listing } from '$lib/types';

	const listings = collectionStore<Listing>(firestore, 'listing');

	onMount(() => {
		if ($page.url.search) replaceState('/', {});
	});

	$: filterBy = $page.url.searchParams.get('filter-by');
	$: search = $page.url.searchParams.get('search')?.toLowerCase() ?? '';
	$: dateParam = $page.url.searchParams.get('date') ?? '';
	$: guests = parseInt($page.url.searchParams.get('guests') ?? '0') || 0;

	$: filteredListings = $listings.filter((l) => {
		if (filterBy && filterBy !== 'all' && l.category?.toLowerCase() !== filterBy.toLowerCase()) return false;
		if (search && !l.location?.toLowerCase().includes(search) && !l.title?.toLowerCase().includes(search)) return false;
		if (guests > 0 && (l.guestCount ?? 0) < guests) return false;
		if (dateParam && l.availableFrom && l.availableTo) {
			if (dateParam < l.availableFrom || dateParam > l.availableTo) return false;
		}
		return true;
	});
</script>

<div class="container mx-auto flex flex-col gap-8">
	<Filters />
	{#if filteredListings.length === 0}
		<div class="flex flex-col items-center justify-center gap-2 py-24 text-center">
			<span class="text-4xl">🔍</span>
			<p class="text-lg font-semibold">No listings found</p>
			<p class="text-sm text-muted-foreground">Try a different category</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each filteredListings as data}
				<ListingComponent {data} />
			{/each}
		</div>
	{/if}
</div>
