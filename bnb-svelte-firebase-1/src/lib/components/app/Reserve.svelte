<script lang="ts">
	import { getLocalTimeZone, DateFormatter } from '@internationalized/date';
	import { page } from '$app/stores';
	import { SignedIn, SignedOut, userStore } from 'sveltefire';
	import { doc, setDoc, updateDoc, increment } from 'firebase/firestore';
	import { MinusIcon, PlusIcon } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card/index';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Listing } from '$lib/types';
	import RangeSelector from './RangeSelector.svelte';
	import Label from '../ui/label/label.svelte';
	import { duration } from '$lib/stores/stayStore';
	import { firestore, auth } from '$lib/firebase';
	import { setAuthModalOpen, connectionStatus } from '$lib/stores/authModalStore';
	import { mintToken, burnToken, calculateReward } from '$lib/Token';
	import { walletAddress } from '$lib/stores/userContext';

	export let listing: Listing;

	let guest = 1;
	const oneDay = 24 * 60 * 60 * 1000;
	let diffDays: number = 1;
	const user = userStore(auth);
	let totalPrice = listing?.price ?? 0;
	let confirmOpen = false;
	let txHash: string | null = null;
	let burnTxHash: string | null = null;
	let isMinting = false;
	let paymentMethod: 'card' | 'tokens' = 'card';
	let cardName = '';
	let cardNumber = '';
	let cardExpiry = '';
	let cardCvv = '';

	const df = new DateFormatter('en-US', { dateStyle: 'medium' });

	function calcDateDiff() {
		if (!$duration.start || !$duration.end || !listing?.price) return;

		const start = $duration.start.toDate(getLocalTimeZone());
		const end = $duration.end.toDate(getLocalTimeZone());

		start.setHours(0, 0, 0, 0);
		end.setHours(0, 0, 0, 0);

		diffDays = Math.round((end.getTime() - start.getTime()) / oneDay);
		if (diffDays < 1) diffDays = 1;

		totalPrice = diffDays * listing.price;
	}

	async function fbRev() {
		await setDoc(doc(firestore, 'reservations', crypto.randomUUID()), {
			userId: $user?.uid,
			listingId: $page.params.id,
			checkIn: $duration.start?.toDate(getLocalTimeZone()),
			checkOut: $duration.end?.toDate(getLocalTimeZone()),
			totalPrice,
			reservedAt: new Date(),
			guestCount: guest,
			paymentMethod,
			rewardTokens: paymentMethod === 'card' ? rewardTokens : 0,
			tokensSpent: paymentMethod === 'tokens' ? rewardTokens : 0,
			txHash: txHash ?? null,
			burnTxHash: burnTxHash ?? null
		});

		// Atomically decrement available rooms on the listing
		if (listing.totalAvailableRooms && listing.totalAvailableRooms > 0) {
			await updateDoc(doc(firestore, 'listing', $page.params.id), {
				totalAvailableRooms: increment(-1)
			});
		}
	}

	async function confirmBooking() {
		confirmOpen = false;
		calcDateDiff();
		totalPrice = diffDays * listing.price;

		if (paymentMethod === 'tokens') {
			// Guard: wallet must be connected to pay with tokens
			if (!$walletAddress) {
				toast.error('Connect your wallet to pay with tokens');
				confirmOpen = true;
				return;
			}
			try {
				isMinting = true;
				const tokenCost = calculateReward(totalPrice);
				toast.loading(`Processing ${tokenCost} HTC token payment...`);
				burnTxHash = await burnToken($walletAddress, tokenCost);
				toast.dismiss();
				if (!burnTxHash) {
					toast.error('Token payment failed or was rejected');
					return;
				}
				toast.success(`Paid ${tokenCost} HTC tokens successfully!`);
			} catch (err: any) {
				toast.dismiss();
				toast.error('Token payment failed', { description: err.message });
				return;
			} finally {
				isMinting = false;
			}
		} else if (paymentMethod === 'card' && $walletAddress) {
			// Pay with card: mint reward tokens as cashback (optional — non-blocking)
			try {
				isMinting = true;
				const reward = calculateReward(totalPrice);
				toast.loading(`Minting ${reward} HTC reward tokens...`);
				txHash = await mintToken($walletAddress, reward);
				toast.dismiss();
				if (txHash) {
					toast.success(`Earned ${reward} HTC tokens as reward!`);
				}
			} catch (err: any) {
				toast.dismiss();
				toast.error('Token minting failed', { description: err.message });
			} finally {
				isMinting = false;
			}
		}

		// Save reservation to Firestore
		toast.promise(fbRev(), {
			loading: 'Booking a reservation...',
			success: 'Reservation booked successfully',
			error(error: any) {
				return `Failed to book a reservation. ${error.message}`;
			}
		});
	}

	function openConfirmModal() {
		calcDateDiff();
		confirmOpen = true;
	}

	$: $duration, calcDateDiff();

	// Reward preview
	$: rewardTokens = calculateReward(totalPrice);
</script>

<!-- Confirmation Modal -->
<Dialog.Root bind:open={confirmOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Confirm your reservation</Dialog.Title>
			<Dialog.Description>Please review your booking details before confirming</Dialog.Description>
		</Dialog.Header>

		<div class="flex flex-col gap-3 py-2">
			<div class="rounded-md border p-4 flex flex-col gap-2">
				<p class="font-semibold text-base">{listing.title}</p>
				<p class="text-sm text-muted-foreground">{listing.location}</p>
			</div>

			<div class="flex flex-col gap-2 text-sm">
				<div class="flex justify-between">
					<span class="text-muted-foreground">Check in</span>
					<span class="font-medium">
						{#if $duration.start}
							{df.format($duration.start.toDate(getLocalTimeZone()))}
						{/if}
					</span>
				</div>
				<div class="flex justify-between">
					<span class="text-muted-foreground">Check out</span>
					<span class="font-medium">
						{#if $duration.end}
							{df.format($duration.end.toDate(getLocalTimeZone()))}
						{/if}
					</span>
				</div>
				<div class="flex justify-between">
					<span class="text-muted-foreground">Guests</span>
					<span class="font-medium">{guest} {guest === 1 ? 'guest' : 'guests'}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-muted-foreground">Duration</span>
					<span class="font-medium">{diffDays} {diffDays === 1 ? 'night' : 'nights'}</span>
				</div>
				<div class="flex justify-between border-t pt-2 font-semibold text-base">
					<span>Total</span>
					<span>₹{totalPrice}</span>
				</div>
				{#if $walletAddress && paymentMethod === 'card'}
					<div class="flex justify-between rounded-md bg-muted p-2 text-sm">
						<span class="text-muted-foreground">🎁 You'll earn</span>
						<span class="font-semibold text-green-600">{rewardTokens} HTC</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- Payment Method -->
		<div class="flex flex-col gap-3 border-t pt-3">
			<p class="text-sm font-semibold">Payment Method</p>
			<div class="flex flex-col gap-2">
				<label class="flex cursor-pointer items-center gap-3 rounded-md border p-3 {paymentMethod === 'card' ? 'border-primary bg-muted/40' : ''}">
					<input type="radio" bind:group={paymentMethod} value="card" class="accent-primary" />
					<span class="text-sm font-medium">Pay with Card</span>
				</label>
				{#if $walletAddress}
					<label class="flex cursor-pointer items-center gap-3 rounded-md border p-3 {paymentMethod === 'tokens' ? 'border-primary bg-muted/40' : ''}">
						<input type="radio" bind:group={paymentMethod} value="tokens" class="accent-primary" />
						<span class="text-sm font-medium">Pay with HTC Tokens <span class="text-muted-foreground">({rewardTokens} HTC)</span></span>
					</label>
				{/if}
			</div>

			<!-- Dummy Card Form -->
			{#if paymentMethod === 'card'}
				<div class="flex flex-col gap-2">
					<input bind:value={cardName} placeholder="Name on card" class="w-full rounded-md border px-3 py-2 text-sm" />
					<input bind:value={cardNumber} placeholder="Card number" maxlength={19} class="w-full rounded-md border px-3 py-2 text-sm" />
					<div class="flex gap-2">
						<input bind:value={cardExpiry} placeholder="MM/YY" maxlength={5} class="w-full rounded-md border px-3 py-2 text-sm" />
						<input bind:value={cardCvv} placeholder="CVV" maxlength={4} class="w-full rounded-md border px-3 py-2 text-sm" />
					</div>
				</div>
			{/if}

			<!-- Token Payment Info -->
			{#if paymentMethod === 'tokens' && $walletAddress}
				<div class="flex flex-col gap-1 rounded-md bg-muted p-3 text-sm">
					<div class="flex justify-between">
						<span class="text-muted-foreground">Token cost</span>
						<span class="font-semibold text-orange-600">{rewardTokens} HTC</span>
					</div>
					<p class="text-xs text-muted-foreground">Tokens will be burned from your wallet to complete payment.</p>
				</div>
			{/if}
		</div>

		<Dialog.Footer class="flex gap-2">
			<Button variant="outline" class="flex-1" on:click={() => (confirmOpen = false)}>Cancel</Button>
			<Button class="flex-1" disabled={isMinting} on:click={confirmBooking}>
				{#if isMinting}
					Processing...
				{:else if paymentMethod === 'tokens'}
					Pay with Tokens
				{:else}
					Confirm & Pay
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Reserve Card -->
<Card.Root class="sticky left-0 right-0 top-0 h-fit">
	<Card.Header>
		<Card.Title>₹{listing?.price} <span class="text-sm font-normal text-muted-foreground">/ night</span></Card.Title>
		<Card.Description>Get yourself a reservation</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="flex w-full flex-col gap-4">
			<div>
				<Label>Add guests</Label>
				<div class="flex w-full items-center justify-evenly mt-2">
					<Button
						disabled={guest <= 1}
						variant="outline"
						class="rounded-full"
						size="icon"
						on:click={() => { guest--; }}
					>
						<MinusIcon class="h-6 w-6" />
					</Button>
					<span class="text-2xl">{guest}</span>
					<Button
						disabled={guest >= listing.guestCount}
						variant="outline"
						class="rounded-full"
						size="icon"
						on:click={() => { guest++; }}
					>
						<PlusIcon class="h-6 w-6" />
					</Button>
				</div>
				<p class="text-xs text-muted-foreground text-center mt-1">Max {listing.guestCount} guests</p>
			</div>
			<div class="space-y-2">
				<Label>Select stay</Label>
				<RangeSelector {listing} />
				{#if listing.availableFrom && listing.availableTo}
					<p class="text-xs text-muted-foreground">
						Available {listing.availableFrom} → {listing.availableTo}
					</p>
				{/if}
				{#if listing.totalAvailableRooms !== undefined}
					<p class="text-xs {listing.totalAvailableRooms <= 3 ? 'text-orange-500' : 'text-muted-foreground'}">
						{listing.totalAvailableRooms} room{listing.totalAvailableRooms === 1 ? '' : 's'} remaining
					</p>
				{/if}
			</div>
		</div>
	</Card.Content>
	<Card.Footer class="flex flex-col gap-4">
		{#if $connectionStatus === 'firebase' || $connectionStatus === 'both' || $connectionStatus === 'metamask'}
			{#if listing.totalAvailableRooms !== undefined && listing.totalAvailableRooms <= 0}
				<Button disabled class="w-full" size="lg">No rooms available</Button>
			{:else}
				<Button on:click={openConfirmModal} class="w-full" size="lg">Reserve</Button>
			{/if}
		{:else}
			<Button on:click={() => setAuthModalOpen()} class="w-full" variant="outline" size="lg">Sign in to reserve</Button>
		{/if}
		<div class="flex w-full flex-col gap-2 border-t pt-4">
			<div class="flex justify-between text-sm">
				<span class="text-muted-foreground">₹{listing.price} × {diffDays} {diffDays === 1 ? 'night' : 'nights'}</span>
				<span>₹{totalPrice}</span>
			</div>
			<div class="flex justify-between text-sm">
				<span class="text-muted-foreground">Guests</span>
				<span>{guest} {guest === 1 ? 'guest' : 'guests'}</span>
			</div>
			{#if $walletAddress}
				<div class="flex justify-between text-sm text-green-600">
					<span>🎁 Reward tokens</span>
					<span>+{rewardTokens} HTC</span>
				</div>
			{/if}
			<div class="flex justify-between font-semibold border-t pt-2">
				<span>Total</span>
				<span>₹{totalPrice}</span>
			</div>
		</div>
	</Card.Footer>
</Card.Root>
