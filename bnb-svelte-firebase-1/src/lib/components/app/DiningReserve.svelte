<script lang="ts">
	import { page } from '$app/stores';
	import { userStore } from 'sveltefire';
	import { doc, setDoc } from 'firebase/firestore';
	import { MinusIcon, PlusIcon } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card/index';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { DiningListing } from '$lib/types';
	import { firestore, auth } from '$lib/firebase';
	import { setAuthModalOpen, connectionStatus } from '$lib/stores/authModalStore';
	import DateSelector from './DateSelector.svelte';
	import { getLocalTimeZone, type DateValue } from '@internationalized/date';
	import { DateFormatter } from '@internationalized/date';
	import { mintToken, burnToken, calculateReward, CONTRACT_ADDRESS } from '$lib/Token';
	import { walletAddress, refreshHtcBalance } from '$lib/stores/userContext';
	import abi from '../../../abi.json';

	export let dining: DiningListing;

	const user = userStore(auth);
	const df = new DateFormatter('en-US', { dateStyle: 'medium' });

	let guests = 1;
	let selectedDate: DateValue | undefined = undefined;
	let confirmOpen = false;
	let paymentMethod: 'card' | 'tokens' = 'card';
	let cardName = '';
	let cardNumber = '';
	let cardExpiry = '';
	let cardCvv = '';
	let isMinting = false;
	let txHash: string | null = null;
	let burnTxHash: string | null = null;

	$: totalPrice = guests * dining.pricePerPerson;
	$: rewardTokens = calculateReward(totalPrice);

	function generateBookingCode(): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
	}

	async function confirmBooking() {
		confirmOpen = false;

		if (paymentMethod === 'tokens') {
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
				await refreshHtcBalance(CONTRACT_ADDRESS, abi);
			} catch (err: any) {
				toast.dismiss();
				toast.error('Token payment failed', { description: err.message });
				return;
			} finally {
				isMinting = false;
			}
		} else if (paymentMethod === 'card' && $walletAddress) {
			try {
				isMinting = true;
				const reward = calculateReward(totalPrice);
				toast.loading(`Minting ${reward} HTC reward tokens...`);
				txHash = await mintToken($walletAddress, reward);
				toast.dismiss();
				if (txHash) {
					toast.success(`Earned ${reward} HTC tokens as reward!`);
					await refreshHtcBalance(CONTRACT_ADDRESS, abi);
				}
			} catch (err: any) {
				toast.dismiss();
				toast.error('Token minting failed', { description: err.message });
			} finally {
				isMinting = false;
			}
		}

		toast.promise(
			setDoc(doc(firestore, 'dining_reservations', crypto.randomUUID()), {
				diningId: $page.params.id,
				userId: $user?.uid,
				date: selectedDate!.toDate(getLocalTimeZone()),
				guestCount: guests,
				totalPrice,
				paymentMethod,
				rewardTokens: paymentMethod === 'card' ? rewardTokens : 0,
				tokensSpent: paymentMethod === 'tokens' ? rewardTokens : 0,
				txHash: txHash ?? null,
				burnTxHash: burnTxHash ?? null,
				bookingCode: generateBookingCode(),
				reservedAt: new Date()
			}),
			{
				loading: 'Booking your table...',
				success: 'Table booked successfully!',
				error: (e: any) => `Booking failed: ${e.message}`
			}
		);
	}
</script>

<!-- Confirmation Modal -->
<Dialog.Root bind:open={confirmOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Confirm your table</Dialog.Title>
			<Dialog.Description>Review your dining reservation before confirming</Dialog.Description>
		</Dialog.Header>

		<div class="flex flex-col gap-3 py-2">
			<div class="rounded-md border p-4 flex flex-col gap-2">
				<p class="font-semibold text-base">{dining.title}</p>
				<p class="text-sm text-muted-foreground">{dining.location} · {dining.cuisine} cuisine</p>
			</div>

			<div class="flex flex-col gap-2 text-sm">
				<div class="flex justify-between">
					<span class="text-muted-foreground">Date</span>
					<span class="font-medium">{selectedDate ? df.format(selectedDate.toDate(getLocalTimeZone())) : '—'}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-muted-foreground">Guests</span>
					<span class="font-medium">{guests} {guests === 1 ? 'guest' : 'guests'}</span>
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
<Card.Root class="sticky top-4 h-fit">
	<Card.Header>
		<Card.Title>₹{dining.pricePerPerson} <span class="text-sm font-normal text-muted-foreground">/ person</span></Card.Title>
		<Card.Description>Book a table</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="flex flex-col gap-4">
			<!-- Date -->
			<div class="flex flex-col gap-1">
				<span class="text-sm font-semibold">Date</span>
				<DateSelector bind:value={selectedDate} />
			</div>

			<!-- Guests -->
			<div class="flex flex-col gap-1">
				<span class="text-sm font-semibold">Guests</span>
				<div class="flex w-full items-center justify-evenly mt-1">
					<Button disabled={guests <= 1} variant="outline" class="rounded-full" size="icon" on:click={() => guests--}>
						<MinusIcon class="h-5 w-5" />
					</Button>
					<span class="text-2xl">{guests}</span>
					<Button disabled={guests >= dining.maxGuests} variant="outline" class="rounded-full" size="icon" on:click={() => guests++}>
						<PlusIcon class="h-5 w-5" />
					</Button>
				</div>
				<p class="text-xs text-muted-foreground text-center mt-1">Max {dining.maxGuests} guests</p>
			</div>
		</div>
	</Card.Content>
	<Card.Footer class="flex flex-col gap-4">
		{#if $connectionStatus === 'both'}
			<Button
				on:click={() => { if (selectedDate) confirmOpen = true; else toast.error('Please select a date'); }}
				class="w-full"
				size="lg"
				disabled={isMinting}
			>
				Reserve
			</Button>
		{:else if $connectionStatus === 'firebase'}
			<Button on:click={() => setAuthModalOpen()} class="w-full" variant="outline" size="lg">
				Connect wallet to reserve
			</Button>
		{:else}
			<Button on:click={() => setAuthModalOpen()} class="w-full" variant="outline" size="lg">
				Sign in to reserve
			</Button>
		{/if}
		<div class="flex w-full flex-col gap-2 border-t pt-4">
			<div class="flex justify-between text-sm">
				<span class="text-muted-foreground">₹{dining.pricePerPerson} × {guests} {guests === 1 ? 'guest' : 'guests'}</span>
				<span>₹{totalPrice}</span>
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
