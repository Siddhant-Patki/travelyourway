<script lang="ts">
	import { SignedIn, SignedOut, collectionStore, userStore } from 'sveltefire';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { setAuthModalOpen } from '$lib/stores/authModalStore';
	import { auth, firestore } from '$lib/firebase';
	import { collection, query, where } from 'firebase/firestore';
	import type { DiningReservation } from '$lib/types';
	import { buttonVariants } from '$lib/components/ui/button';
	import { CalendarIcon, UsersIcon, CreditCardIcon, ExternalLinkIcon, CopyIcon } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	const currentUser = userStore(auth);

	const resRef = collection(firestore, 'dining_reservations');
	$: q = $currentUser?.uid ? query(resRef, where('userId', '==', $currentUser.uid)) : null;
	$: resColl = q ? collectionStore<DiningReservation>(firestore, q as any) : null;

	let selectedRes: DiningReservation | null = null;
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

	function truncateHash(hash: string): string {
		return `${hash.slice(0, 10)}...${hash.slice(-6)}`;
	}

	function copyHash(hash: string) {
		navigator.clipboard.writeText(hash);
		toast.success('Transaction hash copied');
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
				<div class="flex flex-col gap-2 rounded-md border p-4 {isExpired(res.date) ? 'opacity-30' : ''}">
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
					{#if res.paymentMethod === 'card' && res.rewardTokens}
						<p class="text-xs text-green-600">🎁 +{res.rewardTokens} HTC earned</p>
					{:else if res.paymentMethod === 'tokens'}
						<p class="text-xs text-orange-500">🔥 Paid with HTC tokens</p>
					{/if}
					<div class="flex justify-between items-center">
						<Button variant="link" class="p-0 h-auto text-sm" on:click={() => (selectedRes = res)}>
							View more →
						</Button>
						{#if isExpired(res.date)}
							<span class="text-xs text-muted-foreground">Expired</span>
						{/if}
					</div>
				</div>
			{/each}
		{/if}

		<!-- Booking Detail Modal -->
		<Dialog.Root open={!!selectedRes} onOpenChange={(o) => { if (!o) selectedRes = null; }}>
			<Dialog.Content class="max-w-md">
				<Dialog.Header>
					<Dialog.Title>Dining Booking Details</Dialog.Title>
					<Dialog.Description>Full summary of your dining reservation</Dialog.Description>
				</Dialog.Header>

				{#if selectedRes}
					<div class="flex flex-col gap-3 text-sm">

						<!-- Booking Code -->
						{#if selectedRes.bookingCode}
							<div class="flex items-center justify-between rounded-md bg-muted px-3 py-2">
								<span class="text-xs text-muted-foreground uppercase tracking-wide">Booking Code</span>
								<span class="font-mono font-bold tracking-widest">{selectedRes.bookingCode}</span>
							</div>
						{/if}

						<!-- Date -->
						<div class="flex items-center gap-3 rounded-md border p-3">
							<CalendarIcon class="h-4 w-4 shrink-0 text-muted-foreground" />
							<div class="flex flex-col">
								<span class="text-xs text-muted-foreground">Date</span>
								<span class="font-medium">{formatDate(selectedRes.date)}</span>
							</div>
						</div>

						<!-- Guests -->
						<div class="flex items-center gap-3 rounded-md border p-3">
							<UsersIcon class="h-4 w-4 shrink-0 text-muted-foreground" />
							<div class="flex flex-col">
								<span class="text-xs text-muted-foreground">Guests</span>
								<span class="font-medium">{selectedRes.guestCount} {selectedRes.guestCount === 1 ? 'guest' : 'guests'}</span>
							</div>
						</div>

						<!-- Payment -->
						<div class="flex items-center gap-3 rounded-md border p-3">
							<CreditCardIcon class="h-4 w-4 shrink-0 text-muted-foreground" />
							<div class="flex flex-col">
								<span class="text-xs text-muted-foreground">Payment method</span>
								<span class="font-medium capitalize">{selectedRes.paymentMethod ?? 'card'}</span>
							</div>
						</div>

						<!-- Total -->
						<div class="flex justify-between rounded-md bg-muted px-3 py-2 font-semibold">
							<span>Total</span>
							<span>₹{selectedRes.totalPrice?.toLocaleString()}</span>
						</div>

						<!-- Token info -->
						{#if selectedRes.paymentMethod === 'card' && selectedRes.rewardTokens}
							<p class="text-xs text-green-600">🎁 +{selectedRes.rewardTokens} HTC earned on this booking</p>
						{:else if selectedRes.paymentMethod === 'tokens' && selectedRes.tokensSpent}
							<p class="text-xs text-orange-500">🔥 {selectedRes.tokensSpent} HTC spent on this booking</p>
						{/if}

						<!-- Blockchain Transactions -->
						{#if selectedRes.txHash || selectedRes.burnTxHash}
							<div class="flex flex-col gap-2 rounded-md border p-3">
								<p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Blockchain Transactions</p>

								{#if selectedRes.txHash}
									<div class="flex flex-col gap-1">
										<span class="text-xs text-muted-foreground">Reward mint tx</span>
										<div class="flex items-center justify-between gap-2 rounded bg-muted px-2 py-1">
											<code class="text-xs">{truncateHash(selectedRes.txHash)}</code>
											<div class="flex items-center gap-1">
												<button on:click={() => copyHash(selectedRes?.txHash ?? '')} class="text-muted-foreground hover:text-foreground">
													<CopyIcon class="h-3 w-3" />
												</button>
												<a href={`http://localhost:5100/tx/${selectedRes.txHash}`} target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground">
													<ExternalLinkIcon class="h-3 w-3" />
												</a>
											</div>
										</div>
									</div>
								{/if}

								{#if selectedRes.burnTxHash}
									<div class="flex flex-col gap-1">
										<span class="text-xs text-muted-foreground">Token payment tx</span>
										<div class="flex items-center justify-between gap-2 rounded bg-muted px-2 py-1">
											<code class="text-xs">{truncateHash(selectedRes.burnTxHash)}</code>
											<div class="flex items-center gap-1">
												<button on:click={() => copyHash(selectedRes?.burnTxHash ?? '')} class="text-muted-foreground hover:text-foreground">
													<CopyIcon class="h-3 w-3" />
												</button>
												<a href={`http://localhost:5100/tx/${selectedRes.burnTxHash}`} target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground">
													<ExternalLinkIcon class="h-3 w-3" />
												</a>
											</div>
										</div>
									</div>
								{/if}

								<a
									href={`http://localhost:5100/tx/${selectedRes.burnTxHash ?? selectedRes.txHash}`}
									target="_blank"
									rel="noopener noreferrer"
									class={buttonVariants({ variant: 'outline', className: 'w-full mt-1 gap-2' })}
								>
									<ExternalLinkIcon class="h-4 w-4" />
									View on Block Explorer
								</a>
							</div>
						{/if}
					</div>

					<Dialog.Footer>
						<a href={`/dining/${selectedRes.diningId}`} class={buttonVariants({ variant: 'default', className: 'w-full' })}>
							View restaurant
						</a>
					</Dialog.Footer>
				{/if}
			</Dialog.Content>
		</Dialog.Root>

	</SignedIn>
</div>

<SignedOut>
	<div class="flex items-center justify-center py-24">
		<Button on:click={() => setAuthModalOpen()}>Sign in to view your reservations</Button>
	</div>
</SignedOut>
