<script lang="ts">
	import { page } from '$app/stores';
	import { docStore } from 'sveltefire';
	import { firestore } from '$lib/firebase';
	import type { DiningListing } from '$lib/types';
	import DiningReserve from '$lib/components/app/DiningReserve.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';

	const dining = docStore<DiningListing>(firestore, `dining/${$page.params.id}`);
</script>

<div class="container mx-auto flex flex-col gap-8 py-8">
	{#if $dining?.title}
		<h3 class="scroll-m-20 px-4 text-2xl font-semibold tracking-tight">{$dining.title}</h3>
	{:else}
		<Skeleton class="h-[20px] w-44 rounded-md" />
	{/if}

	<div class="grid grid-cols-1 gap-4 md:grid-cols-[70%_30%]">
		<div>
			<div class="flex flex-col gap-2 border-b px-4 pb-4">
				{#if $dining?.imgSrc}
					<img
						src={$dining.imgSrc}
						alt={$dining.title}
						class="aspect-video w-full rounded-lg object-cover object-center"
						draggable="false"
					/>
				{:else}
					<Skeleton class="aspect-video w-full rounded-lg" />
				{/if}
				{#if $dining?.cuisine && $dining.location}
					<span class="scroll-m-20 text-xl font-semibold capitalize tracking-tight">
						{$dining.cuisine} cuisine · {$dining.location}
					</span>
				{:else}
					<Skeleton class="h-3 w-24 rounded-md" />
				{/if}
				<span class="text-sm text-muted-foreground">Up to {$dining?.maxGuests} guests</span>
			</div>
			<div class="flex flex-col border-b p-4">
				{$dining?.description}
			</div>
		</div>

		<div class="relative">
			{#if $dining?.pricePerPerson}
				<DiningReserve dining={$dining} />
			{:else}
				<Skeleton class="h-[300px] w-full rounded-md" />
			{/if}
		</div>
	</div>
</div>
