<script lang="ts">
	import { SignedIn, SignedOut, collectionStore, userStore } from 'sveltefire';
	import { auth, firestore } from '$lib/firebase';
	import { collection, query, where } from 'firebase/firestore';
	import type { DiningReservation } from '$lib/types';
	import Button from '$lib/components/ui/button/button.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { setAuthModalOpen } from '$lib/stores/authModalStore';
	import { toast } from 'svelte-sonner';

	const currentUser = userStore(auth);

	const resRef = collection(firestore, 'dining_reservations');
	$: q = $currentUser?.uid ? query(resRef, where('userId', '==', $currentUser.uid)) : null;
	$: resColl = q ? collectionStore<DiningReservation>(firestore, q as any) : null;

	let sortOrder: 'asc' | 'desc' = 'desc';

	function toMs(val: any): number {
		return val?.toDate ? val.toDate().getTime() : new Date(val).getTime();
	}

	$: sortedRes = [...(($resColl as unknown as DiningReservation[]) ?? [])].sort((a, b) =>
		sortOrder === 'desc' ? toMs(b.date) - toMs(a.date) : toMs(a.date) - toMs(b.date)
	);

	function formatDate(value: any): string {
		if (!value) return '—';
		const date = value?.toDate ? value.toDate() : new Date(value);
		return date.toLocaleDateString('en-US', { dateStyle: 'medium' });
	}

	function isExpired(date: any): boolean {
		const d = date?.toDate ? date.toDate() : new Date(date);
		return d < new Date();
	}
</script>

<div class="container mx-auto flex flex-col gap-4 py-8">
	<SignedIn>
		<div class="flex items-center justify-between">
			<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">Your dining reservations</h4>
			{#if sortedRes.length > 1}
				<Button variant="outline" class="gap-2 text-sm" on:click={() => sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'}>
					{sortOrder === 'desc' ? '↓ Newest first' : '↑ Oldest first'}
				</Button>
			{/if}
		</div>

		{#if sortedRes.length === 0}
			<div class="flex flex-col items-center justify-center gap-2 py-24 text-center">
				<span class="text-4xl">🍽️</span>
				<p class="text-lg font-semibold">No dining reservations yet</p>
				<p class="text-sm text-muted-foreground">Book a table to see it here</p>
				<a href="/dining" class={buttonVariants({ variant: 'outline' })}>Browse restaurants</a>
			</div>
		{:else}
			{#each sortedRes as res}
				<div class="flex flex-col gap-2 rounded-md border p-4 {isExpired(res.date) ? 'opacity-40' : ''}">
					<div class="flex justify-between items-center">
						<p class="font-semibold {isExpired(res.date) ? 'text-muted-foreground' : ''}">{formatDate(res.date)}</p>
						<span class="text-sm text-muted-foreground">{res.guestCount} {res.guestCount === 1 ? 'guest' : 'guests'}</span>
					</div>
					<div class="flex justify-between items-center">
						<span class="font-semibold {isExpired(res.date) ? 'text-muted-foreground' : ''}">₹{res.totalPrice}</span>
						{#if res.bookingCode}
							<span class="font-mono text-xs tracking-widest bg-muted px-2 py-1 rounded"># {res.bookingCode}</span>
						{/if}
					</div>
					<div class="flex justify-between items-center">
						<a href={`/dining/${res.diningId}`} class="text-sm text-primary hover:underline">View restaurant →</a>
						{#if isExpired(res.date)}
							<span class="text-xs text-muted-foreground">Expired</span>
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	</SignedIn>
</div>

<SignedOut>
	<div class="flex items-center justify-center py-24">
		<Button on:click={() => setAuthModalOpen()}>Sign in to view your reservations</Button>
	</div>
</SignedOut>
