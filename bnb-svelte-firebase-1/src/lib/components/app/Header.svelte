<script lang="ts">
	import { SignedIn, SignedOut, userStore } from 'sveltefire';
	import { BookMarkedIcon, LogInIcon, LogOutIcon, MenuIcon, UserIcon, WalletIcon, SunIcon, MoonIcon, SearchIcon } from 'lucide-svelte';
	import { signOut } from 'firebase/auth';
	import { toast } from 'svelte-sonner';

	import { auth } from '$lib/firebase';
	import * as Avatar from '$lib/components/ui/avatar/index';
	import Button from '../ui/button/button.svelte';
	import { setAuthModalOpen } from '$lib/stores/authModalStore';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { walletAddress, htcBalance } from '$lib/stores/userContext';
	import { goto } from '$app/navigation';

	const currentUser = userStore(auth);

	let isDark = false;

	if (typeof window !== 'undefined') {
		isDark = localStorage.getItem('theme') === 'dark' ||
			(!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
		document.documentElement.classList.toggle('dark', isDark);
	}

	function toggleTheme() {
		isDark = !isDark;
		document.documentElement.classList.toggle('dark', isDark);
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	}

	async function handleSignOut() {
		try {
			// Disconnect MetaMask wallet
			if (window.ethereum) {
				try {
					await window.ethereum.request({
						method: 'wallet_revokePermissions',
						params: [{ eth_accounts: {} }]
					});
				} catch (e) {
					console.log('Wallet revoke not supported, clearing locally');
				}
				window.web3 = null;
			}

			// Sign out from Firebase
			await signOut(auth);
			toast.success('Logged out successfully');
			goto('/');
		} catch (err: any) {
			toast.error('Failed to log out', { description: err.message });
		}
	}

	let searchLocation = '';
	let searchDate = '';
	let searchGuests = '';
	let activeTab = 'Stays';

	function handleSearch() {
		const params = new URLSearchParams();
		if (searchLocation) params.set('search', searchLocation.trim());
		if (searchDate) params.set('date', searchDate);
		if (searchGuests) params.set('guests', searchGuests);
		goto(`/?${params.toString()}`);
	}

	function bnbyrHome() {
		if (!$currentUser) {
			toast.info('Sign in to add your bnb');
			setAuthModalOpen();
			return;
		}
		goto('/new-bnb');
	}
</script>

<header class="sticky left-0 right-0 top-0 z-10 bg-background border-b">
	<!-- Top row -->
	<div class="container flex items-center justify-between px-4 pt-4 pb-2 gap-4">
		<a href="/" class="scroll-m-20 text-2xl font-bold tracking-tighter transition-colors shrink-0 hover:opacity-80 text-rose-500">
			Travel your Way
		</a>

		<!-- Nav Tabs -->
		<nav class="flex items-center gap-1">
			{#each [{ label: 'Stays', icon: '🏠', href: '/' }, { label: 'Dining', icon: '🍽️', href: '/dining' }] as tab}
				<a
					href={tab.href}
					on:click={() => activeTab = tab.label}
					class="flex flex-col items-center gap-0.5 px-4 py-1.5 text-sm font-medium border-b-2 transition-colors
						{activeTab === tab.label ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'}"
				>
					<span>{tab.icon}</span>
					<span>{tab.label}</span>
				</a>
			{/each}
		</nav>

		<!-- Right controls -->
		<div class="flex items-center gap-2">
			<Button on:click={toggleTheme} variant="ghost" size="icon" class="rounded-full">
				{#if isDark}
					<SunIcon class="h-5 w-5" />
				{:else}
					<MoonIcon class="h-5 w-5" />
				{/if}
			</Button>

			<!-- HTC Balance chip / Connect wallet button -->
			{#if $walletAddress}
				<button
					on:click={() => goto('/profile')}
					class="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
				>
					<WalletIcon class="h-3.5 w-3.5 text-amber-500" />
					{$htcBalance} HTC
				</button>
			{:else}
				<Button on:click={setAuthModalOpen} variant="outline" size="sm" class="rounded-full gap-1.5 text-xs">
					<WalletIcon class="h-3.5 w-3.5" />
					Connect wallet
				</Button>
			{/if}

			<Button on:click={bnbyrHome} variant="ghost" class="font-semibold text-sm">Add your home</Button>
			<SignedIn let:user>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<button class="flex items-center gap-3 rounded-full border p-2 shadow transition hover:bg-border">
							<Avatar.Root class="size-6">
								<Avatar.Image draggable="false" src={user.photoURL} alt={user.email} />
								<Avatar.Fallback>{user.email?.charAt(0).toUpperCase()}</Avatar.Fallback>
							</Avatar.Root>
							<MenuIcon class="h-5 w-5" />
						</button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Label>My Account</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								<a href="/profile?tab=overview" class="flex items-center">
									<UserIcon class="mr-2 h-4 w-4" />
									<span>My Profile</span>
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<a href="/wallet" class="flex items-center">
									<WalletIcon class="mr-2 h-4 w-4" />
									<span>My Wallet</span>
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<a href="/reservations" class="flex items-center">
									<BookMarkedIcon class="mr-2 h-4 w-4" />
									<span>My Reservations</span>
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<a href="/dining/reservations" class="flex items-center">
									<BookMarkedIcon class="mr-2 h-4 w-4" />
									<span>My Dining Bookings</span>
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item on:click={handleSignOut}>
								<LogOutIcon class="mr-2 h-4 w-4" />
								Log out
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</SignedIn>
			<SignedOut>
				<Button on:click={setAuthModalOpen} variant="outline">
					<LogInIcon class="mr-2 h-4 w-4" />
					Log in
				</Button>
			</SignedOut>
		</div>
	</div>

	<!-- Search Bar row -->
	<div class="container flex justify-center px-4 pb-4">
		<div class="flex items-center rounded-full border shadow-sm bg-background overflow-hidden divide-x w-full max-w-2xl">
			<div class="flex flex-col px-5 py-2 min-w-0 flex-1">
				<span class="text-xs font-semibold">Where</span>
				<input
					bind:value={searchLocation}
					on:keydown={(e) => e.key === 'Enter' && handleSearch()}
					placeholder="Search destinations"
					class="bg-transparent text-sm text-muted-foreground outline-none w-full"
				/>
			</div>
			<div class="flex flex-col px-5 py-2 min-w-0 flex-1">
				<span class="text-xs font-semibold">When</span>
				<input
					bind:value={searchDate}
					type="date"
					class="bg-transparent text-sm text-muted-foreground outline-none w-full"
				/>
			</div>
			<div class="flex items-center gap-3 px-3 py-2">
				<div class="flex flex-col min-w-0">
					<span class="text-xs font-semibold">Who</span>
					<input
						bind:value={searchGuests}
						placeholder="Add guests"
						type="number"
						min="1"
						class="bg-transparent text-sm text-muted-foreground outline-none w-24"
					/>
				</div>
				<button
					on:click={handleSearch}
					class="bg-rose-500 hover:bg-rose-600 text-white rounded-full p-3 shrink-0 transition"
				>
					<SearchIcon class="h-4 w-4" />
				</button>
			</div>
		</div>
	</div>
</header>