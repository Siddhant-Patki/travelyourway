import { writable, derived } from 'svelte/store';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '$lib/firebase';

// Firebase user
export const firebaseUser = writable<User | null>(null);

// Wallet data
export const walletAddress = writable<string | null>(null);
export const walletBalance = writable<string>('0');
export const htcBalance = writable<string>('0');

// Listen to Firebase auth state
onAuthStateChanged(auth, (user) => {
	firebaseUser.set(user);
});

// Listen to MetaMask account changes globally
if (typeof window !== 'undefined' && window.ethereum) {
	window.ethereum.on('accountsChanged', (accounts: string[]) => {
		walletAddress.set(accounts.length > 0 ? accounts[0] : null);
	});
}

// Derived store — single object with everything
export const userContext = derived(
	[firebaseUser, walletAddress, walletBalance, htcBalance],
	([$firebaseUser, $walletAddress, $walletBalance, $htcBalance]) => ({
		// Firebase data
		uid: $firebaseUser?.uid ?? null,
		email: $firebaseUser?.email ?? null,
		displayName: $firebaseUser?.displayName ?? null,
		photoURL: $firebaseUser?.photoURL ?? null,
		isFirebaseSignedIn: !!$firebaseUser,

		// Wallet data
		walletAddress: $walletAddress,
		walletBalance: $walletBalance,
		htcBalance: $htcBalance,
		isWalletConnected: !!$walletAddress,

		// Combined
		isFullyConnected: !!$firebaseUser && !!$walletAddress,
	})
);

// Refresh just the HTC balance from blockchain
export async function refreshHtcBalance(contractAddress: string, abi: any) {
	if (typeof window === 'undefined' || !window.ethereum) return;
	try {
		const Web3 = (await import('web3')).default;
		const web3 = new Web3(window.ethereum);
		const accounts = await window.ethereum.request({ method: 'eth_accounts' });
		if (accounts.length === 0) return;
		const contract = new web3.eth.Contract(abi, contractAddress);
		const htcBal = await contract.methods.balanceOf(accounts[0]).call() as string;
		htcBalance.set(parseFloat(web3.utils.fromWei(htcBal, 'ether')).toFixed(2));
	} catch (error) {
		console.error('Failed to refresh HTC balance:', error);
	}
}

// Call this after MetaMask connects to populate wallet + HTC balance
export async function syncWalletData(contractAddress: string, abi: any) {
	if (typeof window === 'undefined' || !window.ethereum) return;

	try {
		const Web3 = (await import('web3')).default;
		const web3 = new Web3(window.ethereum);
		const accounts = await window.ethereum.request({ method: 'eth_accounts' });
		if (accounts.length === 0) return;

		walletAddress.set(accounts[0]);

		// Get ETH balance
		const ethBal = await web3.eth.getBalance(accounts[0]);
		walletBalance.set(parseFloat(web3.utils.fromWei(ethBal, 'ether')).toFixed(4));

		// Get HTC balance
		const contract = new web3.eth.Contract(abi, contractAddress);
		const htcBal = await contract.methods.balanceOf(accounts[0]).call() as string;
		htcBalance.set(parseFloat(web3.utils.fromWei(htcBal, 'ether')).toFixed(2));
	} catch (error) {
		console.error('Failed to sync wallet data:', error);
	}
}