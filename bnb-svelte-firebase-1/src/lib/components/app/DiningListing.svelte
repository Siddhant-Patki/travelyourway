<script lang="ts">
	import { HeartIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import type { DiningListing } from '$lib/types';

	export let data: DiningListing;
</script>

<a draggable="false" href={`/dining/${data.id}`} class="group flex flex-col gap-2 p-4">
	<div class="relative overflow-hidden rounded-md">
		<Button
			size="icon"
			variant="ghost"
			class="absolute right-4 top-4 border-2 border-white text-white backdrop-blur"
		>
			<HeartIcon class="h-4 w-4" />
		</Button>
		<img
			src={data.imgSrc}
			alt={data.title}
			class="aspect-square w-full rounded-md object-cover object-center transition duration-300 group-hover:scale-105"
			draggable="false"
		/>
	</div>
	<div class="flex flex-col gap-1">
		<span class="text-md font-bold">{data.title}, {data.location}</span>
		<span class="text-sm text-muted-foreground">{data.cuisine} cuisine</span>
		<span class="font-semibold">₹{data.pricePerPerson} <span class="font-normal text-muted-foreground">/ person</span></span>
	</div>
</a>
