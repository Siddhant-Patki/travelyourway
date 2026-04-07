<script lang="ts">
	import { onMount } from 'svelte';
	import { collectionStore, userStore } from 'sveltefire';
	import { collection, query, where, orderBy } from 'firebase/firestore';
	import { auth, firestore } from '$lib/firebase';
	import { walletAddress, htcBalance, refreshHtcBalance } from '$lib/stores/userContext';
	import { CONTRACT_ADDRESS, DEPLOYER_ADDRESS } from '$lib/Token';
	import { setAuthModalOpen } from '$lib/stores/authModalStore';
	import { toast } from 'svelte-sonner';
	import Button from '$lib/components/ui/button/button.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { CopyIcon, WalletIcon, CoinsIcon, ArrowUpIcon, ArrowDownIcon, ExternalLinkIcon } from 'lucide-svelte';
	import abi from '../../abi.json';

	const currentUser = userStore(auth);

	// Fetch stays reservations
	const staysRef = collection(firestore, 'reservations');
	$: staysQ = $currentUser?.uid ? query(staysRef, where('userId', '==', $currentUser.uid)) : null;
	$: staysColl = staysQ ? collectionStore(firestore, staysQ as any) : null;

	// Fetch dining reservations
	const diningRef = collection(firestore, 'dining_reservations');
	$: diningQ = $currentUser?.uid ? query(diningRef, where('userId', '==', $currentUser.uid)) : null;
	$: diningColl = diningQ ? collectionStore(firestore, diningQ as any) : null;

	// Merge all transactions into a unified timeline
	$: allTx = [
		...(($staysColl as any[]) ?? []).flatMap((r: any) => {
			const txs = [];
			if (r.txHash) txs.push({
				type: 'mint',
				amount: r.rewardTokens ?? 0,
				hash: r.txHash,
				label: `Stay reward — ${r.bookingCode ?? ''}`,
				date: r.reservedAt,
			});
			if (r.burnTxHash) txs.push({
				type: 'burn',
				amount: r.tokensSpent ?? 0,
				hash: r.burnTxHash,
				label: `Stay payment — ${r.bookingCode ?? ''}`,
				date: r.reservedAt,
			});
			return txs;
		}),
		...(($diningColl as any[]) ?? []).flatMap((r: any) => {
			const txs = [];
			if (r.txHash) txs.push({
				type: 'mint',
				amount: r.rewardTokens ?? 0,
				hash: r.txHash,
				label: `Dining reward — ${r.bookingCode ?? ''}`,
				date: r.reservedAt,
			});
			if (r.burnTxHash) txs.push({
				type: 'burn',
				amount: r.tokensSpent ?? 0,
				hash: r.burnTxHash,
				label: `Dining payment — ${r.bookingCode ?? ''}`,
				date: r.reservedAt,
			});
			return txs;
		}),
	].sort((a, b) => {
		const ta = a.date?.toDate ? a.date.toDate().getTime() : new Date(a.date).getTime();
		const tb = b.date?.toDate ? b.date.toDate().getTime() : new Date(b.date).getTime();
		return tb - ta;
	});

	$: totalEarned = allTx.filter(t => t.type === 'mint').reduce((s, t) => s + t.amount, 0);
	$: totalSpent  = allTx.filter(t => t.type === 'burn').reduce((s, t) => s + t.amount, 0);

	function formatDate(val: any): string {
		if (!val) return '—';
		const d = val?.toDate ? val.toDate() : new Date(val);
		return d.toLocaleDateString('en-US', { dateStyle: 'medium' });
	}

	function truncate(hash: string): string {
		return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
	}

	function copy(text: string, label = 'Copied!') {
		navigator.clipboard.writeText(text);
		toast.success(label);
	}

	onMount(async () => {
		if ($walletAddress) await refreshHtcBalance(CONTRACT_ADDRESS, abi);
	});
</script>

<div class="container mx-auto flex flex-col gap-8 py-8 max-w-3xl">
	<div class="flex items-center gap-3">
		<WalletIcon class="h-6 w-6 text-amber-500" />
		<h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">My Wallet</h2>
	</div>

	{#if !$walletAddress}
		<!-- Not connected -->
		<div class="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-20 text-center">
			<WalletIcon class="h-12 w-12 text-muted-foreground" />
			<p class="text-lg font-semibold">No wallet connected</p>
			<p class="text-sm text-muted-foreground">Connect MetaMask to view your HTC balance and transaction history</p>
			<Button on:click={setAuthModalOpen}>Connect Wallet</Button>
		</div>
	{:else}
		<!-- Balance card -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="col-span-1 sm:col-span-1 flex flex-col gap-1 rounded-xl border bg-amber-50 dark:bg-amber-950/30 p-5">
				<span class="text-xs font-semibold text-amber-600 uppercase tracking-wide">HTC Balance</span>
				<p class="text-4xl font-bold text-amber-600">{$htcBalance}</p>
				<span class="text-sm text-muted-foreground">HotelCoin tokens</span>
			</div>
			<div class="flex flex-col gap-1 rounded-xl border p-5">
				<span class="text-xs font-semibold text-green-600 uppercase tracking-wide">Total Earned</span>
				<p class="text-3xl font-bold text-green-600">+{totalEarned}</p>
				<span class="text-sm text-muted-foreground">From card bookings</span>
			</div>
			<div class="flex flex-col gap-1 rounded-xl border p-5">
				<span class="text-xs font-semibold text-orange-600 uppercase tracking-wide">Total Spent</span>
				<p class="text-3xl font-bold text-orange-600">−{totalSpent}</p>
				<span class="text-sm text-muted-foreground">Redeemed on bookings</span>
			</div>
		</div>

		<!-- Contract info -->
		<div class="flex flex-col gap-3 rounded-xl border p-5">
			<p class="text-sm font-semibold">Contract Info</p>
			<div class="flex flex-col gap-2 text-sm">
				<div class="flex items-center justify-between gap-2 rounded-md bg-muted px-3 py-2">
					<div class="flex flex-col min-w-0">
						<span class="text-xs text-muted-foreground">HTC Token Contract</span>
						<span class="font-mono truncate">{CONTRACT_ADDRESS}</span>
					</div>
					<button on:click={() => copy(CONTRACT_ADDRESS, 'Contract address copied')} class="shrink-0 text-muted-foreground hover:text-foreground">
						<CopyIcon class="h-4 w-4" />
					</button>
				</div>
				<div class="flex items-center justify-between gap-2 rounded-md bg-muted px-3 py-2">
					<div class="flex flex-col min-w-0">
						<span class="text-xs text-muted-foreground">Your Wallet Address</span>
						<span class="font-mono truncate">{$walletAddress}</span>
					</div>
					<button on:click={() => copy($walletAddress ?? '', 'Wallet address copied')} class="shrink-0 text-muted-foreground hover:text-foreground">
						<CopyIcon class="h-4 w-4" />
					</button>
				</div>
				<div class="flex items-center justify-between gap-2 rounded-md bg-muted px-3 py-2">
					<div class="flex flex-col min-w-0">
						<span class="text-xs text-muted-foreground">Network</span>
						<span class="font-mono">Ganache (Chain ID 1337)</span>
					</div>
					<span class="shrink-0 text-xs text-green-600 font-semibold">● Local</span>
				</div>
			</div>
		</div>

		<!-- Transaction history -->
		<div class="flex flex-col gap-3">
			<p class="text-sm font-semibold">Transaction History</p>

			{#if allTx.length === 0}
				<div class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-12 text-center">
					<CoinsIcon class="h-8 w-8 text-muted-foreground" />
					<p class="text-sm text-muted-foreground">No on-chain transactions yet</p>
					<p class="text-xs text-muted-foreground">Book a stay or dining with card to earn HTC tokens</p>
				</div>
			{:else}
				<div class="flex flex-col divide-y rounded-xl border overflow-hidden">
					{#each allTx as tx}
						<div class="flex items-center gap-4 px-4 py-3 hover:bg-muted/40 transition-colors">
							<!-- Icon -->
							<div class="shrink-0 flex items-center justify-center rounded-full w-9 h-9
								{tx.type === 'mint' ? 'bg-green-100 dark:bg-green-900/40' : 'bg-orange-100 dark:bg-orange-900/40'}">
								{#if tx.type === 'mint'}
									<ArrowDownIcon class="h-4 w-4 text-green-600" />
								{:else}
									<ArrowUpIcon class="h-4 w-4 text-orange-600" />
								{/if}
							</div>

							<!-- Label + hash -->
							<div class="flex flex-col min-w-0 flex-1">
								<span class="text-sm font-medium truncate">{tx.label}</span>
								<span class="font-mono text-xs text-muted-foreground truncate">{truncate(tx.hash)}</span>
							</div>

							<!-- Date -->
							<span class="text-xs text-muted-foreground shrink-0">{formatDate(tx.date)}</span>

							<!-- Amount -->
							<span class="shrink-0 font-semibold text-sm {tx.type === 'mint' ? 'text-green-600' : 'text-orange-600'}">
								{tx.type === 'mint' ? '+' : '−'}{tx.amount} HTC
							</span>

							<!-- Copy hash -->
							<button on:click={() => copy(tx.hash, 'Tx hash copied')} class="shrink-0 text-muted-foreground hover:text-foreground">
								<CopyIcon class="h-3.5 w-3.5" />
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
