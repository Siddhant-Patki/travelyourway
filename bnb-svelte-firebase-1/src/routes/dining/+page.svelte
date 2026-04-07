<script lang="ts">
	import { collectionStore } from 'sveltefire';
	import { firestore } from '$lib/firebase';
	import type { DiningListing } from '$lib/types';
	import DiningListingComponent from '$lib/components/app/DiningListing.svelte';

	const dinings = collectionStore<DiningListing>(firestore, 'dining');

	const cuisines = ['All', 'Indian', 'Italian', 'Chinese', 'Continental', 'Japanese', 'Mexican'];
	let activeCuisine = 'All';

	$: filtered = activeCuisine === 'All'
		? $dinings
		: $dinings.filter(d => d.cuisine === activeCuisine);
</script>

<div class="container mx-auto flex flex-col gap-8 py-6">
	<!-- Cuisine filters -->
	<div class="flex items-center gap-4 overflow-x-auto pb-1">
		{#each cuisines as c}
			<button
				on:click={() => activeCuisine = c}
				class="flex flex-col items-center gap-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors shrink-0
					{activeCuisine === c ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}"
			>
				{c}
			</button>
		{/each}
	</div>

	{#if filtered.length === 0}
		<div class="flex flex-col items-center justify-center gap-2 py-24 text-center">
			<span class="text-4xl">🍽️</span>
			<p class="text-lg font-semibold">No dining listings found</p>
			<p class="text-sm text-muted-foreground">Try a different cuisine</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each filtered as data}
				<DiningListingComponent {data} />
			{/each}
		</div>
	{/if}
</div>
