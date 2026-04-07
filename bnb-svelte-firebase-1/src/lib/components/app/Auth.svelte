<script lang="ts">
	import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
	import { toast } from 'svelte-sonner';
	import Web3 from 'web3';
	import { auth } from '$lib/firebase';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '../ui/button/button.svelte';
	import { open, setAuthModalClose, checkMetamaskConnection } from '$lib/stores/authModalStore';
	import abi from '../../../abi.json';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { syncWalletData, refreshHtcBalance } from '$lib/stores/userContext';

	// Contract address — update this after Hardhat deploy
	const contractAddress = '0x09d1e4B23E723e4b968e58e33fDe50e7891f7E05';

	let accs = writable<string[]>([]);
	$: isConnected = $accs.length > 0;

	// On mount — check if MetaMask is already connected
	onMount(async () => {
		if (!window.ethereum) return;
		try {
			const existing = await window.ethereum.request({ method: 'eth_accounts' });
			if (existing.length > 0) {
				accs.set(existing);
				window.web3 = new Web3(window.ethereum);
				// Restore wallet store state + HTC balance on reload
				await syncWalletData(contractAddress, abi);
				await checkMetamaskConnection();
			}

			// Refresh HTC balance whenever user switches back to this tab
			// 1s delay to allow Ganache to mine the block before reading balance
			document.addEventListener('visibilitychange', async () => {
				if (document.visibilityState === 'visible') {
					await new Promise(r => setTimeout(r, 1000));
					await refreshHtcBalance(contractAddress, abi);
				}
			});

			// Listen for account changes
			window.ethereum.on('accountsChanged', async (accounts: string[]) => {
				accs.set(accounts);
				if (accounts.length > 0) {
					window.web3 = new Web3(window.ethereum);
					await syncWalletData(contractAddress, abi);
					await checkMetamaskConnection();
				} else {
					window.web3 = null;
				}
			});
		} catch (error) {
			console.error('Error checking MetaMask accounts:', error);
		}
	});

	// Connect MetaMask wallet
	async function connectWallet() {
		if (!window.ethereum) {
			toast.error('MetaMask not found. Please install it.');
			return;
		}
		try {
			const acc = await window.ethereum.request({ method: 'eth_requestAccounts' });
			window.web3 = new Web3(window.ethereum);
			accs.set(acc);
			toast.success(`Wallet connected: ${acc[0].slice(0, 6)}...${acc[0].slice(-4)}`);
			await syncWalletData(contractAddress, abi);
		} catch (error: any) {
			toast.error('Failed to connect wallet', { description: error.message });
			throw error;
		}
	}

	// Google sign in → then connect wallet
	async function signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		const res = await signInWithPopup(auth, provider);
		setAuthModalClose();
		return res.user.email;
	}

	async function handleSignInWithGoogle() {
		toast.promise(
			async () => {
				const email = await signInWithGoogle();
				await connectWallet();
				return email;
			},
			{
				loading: 'Signing in with Google...',
				success: (email: any) => `Signed in as ${email}`,
				error: (err: any) => `Failed to sign in: ${err.message}`
			}
		);
	}

	// Disconnect wallet
	export async function disconnectWallet() {
		try {
			await window.ethereum?.request({
				method: 'wallet_revokePermissions',
				params: [{ eth_accounts: {} }]
			});
		} catch (error) {
			console.log('Revoke not supported, clearing locally');
		}
		accs.set([]);
		window.web3 = null;
		toast.success('Wallet disconnected');
	}
</script>

<Dialog.Root bind:open={$open}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Login or sign up</Dialog.Title>
			<Dialog.Description>
				Connect your Google account and MetaMask wallet to continue
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex flex-col gap-2">
			{#if isConnected}
				<div class="rounded-md border p-3 text-sm text-muted-foreground">
					Connected: {$accs[0].slice(0, 6)}...{$accs[0].slice(-4)}
				</div>
				<Button variant="outline" on:click={disconnectWallet}>Disconnect wallet</Button>
			{:else}
				<Button on:click={handleSignInWithGoogle}>Continue with Google + MetaMask</Button>
			{/if}
			<Button variant="ghost" on:click={setAuthModalClose}>Close</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>