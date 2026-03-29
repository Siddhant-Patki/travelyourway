import { writable } from 'svelte/store';
import { toast } from 'svelte-sonner';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '$lib/firebase';

export const open = writable<boolean>(false);
export const metamaskConnected = writable<boolean>(false);

export type ConnectionStatus = 'disconnected' | 'metamask' | 'firebase' | 'both';
export const connectionStatus = writable<ConnectionStatus>('disconnected');

// Listen to Firebase auth state and update connectionStatus automatically
onAuthStateChanged(auth, (user) => {
	if (user) {
		connectionStatus.update((current) =>
			current === 'metamask' || current === 'both' ? 'both' : 'firebase'
		);
	} else {
		connectionStatus.update((current) =>
			current === 'both' || current === 'metamask' ? 'metamask' : 'disconnected'
		);
	}
});

// Listen to MetaMask account changes
if (typeof window !== 'undefined' && window.ethereum) {
	window.ethereum.on('accountsChanged', (accounts: string[]) => {
		const connected = accounts.length > 0;
		metamaskConnected.set(connected);
		connectionStatus.update((current) => {
			const hasFirebase = current === 'firebase' || current === 'both';
			if (connected) return hasFirebase ? 'both' : 'metamask';
			return hasFirebase ? 'firebase' : 'disconnected';
		});
	});
}

export async function checkMetamaskConnection() {
	if (typeof window === 'undefined' || !window.ethereum) {
		metamaskConnected.set(false);
		return false;
	}
	try {
		const accounts = await window.ethereum.request({ method: 'eth_accounts' });
		const connected = Array.isArray(accounts) && accounts.length > 0;
		metamaskConnected.set(connected);
		connectionStatus.update((current) => {
			const hasFirebase = current === 'firebase' || current === 'both';
			if (connected) return hasFirebase ? 'both' : 'metamask';
			return hasFirebase ? 'firebase' : 'disconnected';
		});
		return connected;
	} catch (error) {
		console.error('MetaMask connection check failed:', error);
		metamaskConnected.set(false);
		return false;
	}
}

export async function setAuthModalOpen() {
	const connected = await checkMetamaskConnection();

	if (connected) {
		const address = (await window.ethereum.request({ method: 'eth_accounts' }))[0];
		toast.success(`Already connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
		open.set(false);
		return;
	}

	open.set(true);
}

export function setAuthModalClose() {
	open.set(false);
}
