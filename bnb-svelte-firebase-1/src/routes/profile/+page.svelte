<script lang="ts">
	import { SignedIn, SignedOut, collectionStore, userStore } from 'sveltefire';
	import { collection, query, where } from 'firebase/firestore';
	import { auth, firestore } from '$lib/firebase';
	import { setAuthModalOpen } from '$lib/stores/authModalStore';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Avatar from '$lib/components/ui/avatar/index';
	import type { Listing, Reservation } from '$lib/types';
	import * as Dialog from '$lib/components/ui/dialog';
	import { CoinsIcon, CalendarIcon, MapPinIcon, HomeIcon, UsersIcon, CreditCardIcon } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { htcBalance } from '$lib/stores/userContext';

	let selectedRes: Reservation | null = null;

	const currentUser = userStore(auth);

	const resRef = collection(firestore, 'reservations');
	$: q = query(resRef, where('userId', '==', $currentUser?.uid ?? ''));
	$: resColl = collectionStore<Reservation>(firestore, q as any);

	const listingRef = collection(firestore, 'listing');
	$: lq = query(listingRef, where('userId', '==', $currentUser?.uid ?? ''));
	$: myListings = collectionStore<Listing>(firestore, lq as any);

	function formatDate(value: any): string {
		if (!value) return '—';
		const date = value?.toDate ? value.toDate() : new Date(value);
		return date.toLocaleDateString('en-US', { dateStyle: 'medium' });
	}

	$: availableTokens = $htcBalance;

	$: activeTab = $page.url.searchParams.get('tab') ?? 'overview';
</script>

<div class="container mx-auto flex flex-col gap-8 py-8">
	<SignedIn let:user>

		<!-- Profile Header -->
		<div class="flex items-center gap-6 rounded-xl border p-6">
			<Avatar.Root class="h-20 w-20">
				<Avatar.Image src={user.photoURL} alt={user.displayName ?? user.email} draggable="false" />
				<Avatar.Fallback class="text-2xl font-bold">
					{user.email?.charAt(0).toUpperCase()}
				</Avatar.Fallback>
			</Avatar.Root>
			<div class="flex flex-col gap-1">
				<h2 class="text-2xl font-bold">{user.displayName ?? 'Traveller'}</h2>
				<p class="text-sm text-muted-foreground">{user.email}</p>
				<p class="text-xs text-muted-foreground">
					Member since {new Date(user.metadata.creationTime ?? '').toLocaleDateString('en-US', { dateStyle: 'medium' })}
				</p>
			</div>
		</div>

		<!-- Inner Tab Nav -->
		<div class="flex border-b">
			<button
				on:click={() => goto('/profile?tab=overview')}
				class={cn(
					'px-6 py-3 text-sm font-semibold transition border-b-2 -mb-[2px]',
					activeTab === 'overview'
						? 'border-black text-black dark:border-white dark:text-white'
						: 'border-transparent text-muted-foreground hover:text-foreground'
				)}
			>
				Overview
			</button>
			<button
				on:click={() => goto('/profile?tab=myhome')}
				class={cn(
					'px-6 py-3 text-sm font-semibold transition border-b-2 -mb-[2px]',
					activeTab === 'myhome'
						? 'border-black text-black dark:border-white dark:text-white'
						: 'border-transparent text-muted-foreground hover:text-foreground'
				)}
			>
				My Homes
			</button>
		</div>

		<!-- Overview Tab -->
		{#if activeTab === 'overview'}
			<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
				<div class="flex flex-col gap-1 rounded-lg border p-4">
					<div class="flex items-center gap-2 text-muted-foreground">
						<CalendarIcon class="h-4 w-4" />
						<span class="text-sm">Total Stays</span>
					</div>
					<p class="text-2xl font-bold">{$resColl.length}</p>
				</div>
				<div class="flex flex-col gap-2 rounded-lg border p-4">
					<div class="flex items-center gap-2 text-muted-foreground">
						<CoinsIcon class="h-4 w-4" />
						<span class="text-sm">HTC Tokens</span>
					</div>
					<p class="text-2xl font-bold">{availableTokens} HTC</p>
					<p class="text-xs text-muted-foreground">Live balance from wallet</p>
					<Button variant="outline" size="sm" class="mt-1 w-full" on:click={() => goto('/')}>Redeem</Button>
				</div>
				<div class="flex flex-col gap-1 rounded-lg border p-4">
					<div class="flex items-center gap-2 text-muted-foreground">
						<HomeIcon class="h-4 w-4" />
						<span class="text-sm">Total Spent</span>
					</div>
					<p class="text-2xl font-bold">
						₹{$resColl.reduce((acc, r) => acc + (r.totalPrice ?? 0), 0).toLocaleString()}
					</p>
				</div>
			</div>

			<div class="flex flex-col gap-4">
				<h3 class="text-lg font-semibold">Your Reservations</h3>
				{#if $resColl.length === 0}
					<div class="flex flex-col items-center justify-center gap-3 rounded-xl border py-16 text-center">
						<span class="text-4xl">🏨</span>
						<p class="font-semibold">No reservations yet</p>
						<p class="text-sm text-muted-foreground">Your bookings will appear here</p>
						<a href="/" class={buttonVariants({ variant: 'outline' })}>Browse listings</a>
					</div>
				{:else}
					<div class="flex flex-col gap-3">
						{#each $resColl as res}
							<div class="flex flex-col gap-3 rounded-lg border p-4 transition hover:bg-muted/40">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-2 text-sm text-muted-foreground">
										<CalendarIcon class="h-4 w-4" />
										<span>Booked on {formatDate(res.checkIn)}</span>
									</div>
									<span class="font-semibold">₹{res.totalPrice?.toLocaleString()}</span>
								</div>
								<div class="flex items-center gap-2 text-sm">
									<MapPinIcon class="h-4 w-4 text-muted-foreground" />
									<span>{formatDate(res.checkIn)} → {formatDate(res.checkOut)}</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm text-muted-foreground">
										{res.guestCount} {res.guestCount === 1 ? 'guest' : 'guests'}
									</span>
									<Button variant="link" class="p-0 h-auto" on:click={() => (selectedRes = res)}>
										View more →
									</Button>
								</div>
								{#if res.paymentMethod === 'card' && res.rewardTokens}
									<p class="text-xs text-green-600">🎁 +{res.rewardTokens} HTC earned</p>
								{:else if res.paymentMethod === 'tokens'}
									<p class="text-xs text-orange-500">🔥 Paid with HTC tokens</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>

		<!-- My Homes Tab -->
		{:else if activeTab === 'myhome'}
			<div class="flex flex-col gap-4">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-semibold">My Listed Homes</h3>
					<a href="/new-bnb" class={buttonVariants({ variant: 'outline' })}>+ Add new</a>
				</div>

				{#if $myListings.length === 0}
					<div class="flex flex-col items-center justify-center gap-3 rounded-xl border py-16 text-center">
						<span class="text-4xl">🏠</span>
						<p class="font-semibold">No listings yet</p>
						<p class="text-sm text-muted-foreground">Start earning by listing your home</p>
						<a href="/new-bnb" class={buttonVariants({ variant: 'outline' })}>List your home</a>
					</div>
				{:else}
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
						{#each $myListings as listing}
							<a href={`/rooms/${listing.id}`} class="group flex flex-col gap-2 rounded-lg border p-4 transition hover:bg-muted/40">
								<div class="overflow-hidden rounded-md">
									<img
										src={listing.imgSrc}
										alt={listing.title}
										class="aspect-video w-full object-cover object-center transition duration-300 group-hover:scale-105"
										draggable="false"
									/>
								</div>
								<div class="flex flex-col gap-1">
									<p class="font-semibold">{listing.title}</p>
									<p class="text-sm text-muted-foreground">{listing.location}</p>
									<div class="flex items-center justify-between">
										<span class="text-sm font-semibold">₹{listing.price} <span class="font-normal text-muted-foreground">/ night</span></span>
										<span class="text-xs text-muted-foreground capitalize">{listing.category}</span>
									</div>
								</div>
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Booking Detail Modal -->
		<Dialog.Root open={!!selectedRes} onOpenChange={(o) => { if (!o) selectedRes = null; }}>
			<Dialog.Content class="max-w-sm">
				<Dialog.Header>
					<Dialog.Title>Booking Details</Dialog.Title>
					<Dialog.Description>Summary of your reservation</Dialog.Description>
				</Dialog.Header>
				{#if selectedRes}
					<div class="flex flex-col gap-3 text-sm">
						<div class="flex items-center gap-3 rounded-md border p-3">
							<CalendarIcon class="h-4 w-4 shrink-0 text-muted-foreground" />
							<div class="flex flex-col">
								<span class="text-xs text-muted-foreground">Stay</span>
								<span class="font-medium">{formatDate(selectedRes.checkIn)} → {formatDate(selectedRes.checkOut)}</span>
							</div>
						</div>
						<div class="flex items-center gap-3 rounded-md border p-3">
							<UsersIcon class="h-4 w-4 shrink-0 text-muted-foreground" />
							<div class="flex flex-col">
								<span class="text-xs text-muted-foreground">Guests</span>
								<span class="font-medium">{selectedRes.guestCount} {selectedRes.guestCount === 1 ? 'guest' : 'guests'}</span>
							</div>
						</div>
						<div class="flex items-center gap-3 rounded-md border p-3">
							<CreditCardIcon class="h-4 w-4 shrink-0 text-muted-foreground" />
							<div class="flex flex-col">
								<span class="text-xs text-muted-foreground">Payment</span>
								<span class="font-medium capitalize">{selectedRes.paymentMethod ?? 'card'}</span>
							</div>
						</div>
						<div class="flex justify-between rounded-md bg-muted px-3 py-2 font-semibold">
							<span>Total</span>
							<span>₹{selectedRes.totalPrice?.toLocaleString()}</span>
						</div>
						{#if selectedRes.paymentMethod === 'card' && selectedRes.rewardTokens}
							<p class="text-xs text-green-600">🎁 +{selectedRes.rewardTokens} HTC earned on this booking</p>
						{:else if selectedRes.paymentMethod === 'tokens' && selectedRes.tokensSpent}
							<p class="text-xs text-orange-500">🔥 {selectedRes.tokensSpent} HTC spent on this booking</p>
						{/if}
					</div>
					<Dialog.Footer>
						<a href={`/rooms/${selectedRes.listingId}`} class={buttonVariants({ variant: 'default', className: 'w-full' })}>
							View listing
						</a>
					</Dialog.Footer>
				{/if}
			</Dialog.Content>
		</Dialog.Root>

	</SignedIn>

	<SignedOut>
		<div class="flex flex-col items-center justify-center gap-4 py-32 text-center">
			<span class="text-5xl">👤</span>
			<p class="text-xl font-semibold">Sign in to view your profile</p>
			<Button on:click={() => setAuthModalOpen()}>Sign in</Button>
		</div>
	</SignedOut>
</div>