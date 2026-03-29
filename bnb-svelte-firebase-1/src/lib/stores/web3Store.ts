import { writable } from 'svelte/store';
import type Web3 from 'web3';

export const web3Instance = writable<Web3 | null>(null);

export function setWeb3Instance(instance: Web3 | null) {
	web3Instance.set(instance);
}

export async function initWeb3() {
	if (typeof window === 'undefined' || !window.ethereum) {
		setWeb3Instance(null);
		return null;
	}

	const web3 = new (await import('web3')).default(window.ethereum);
	await window.ethereum.enable();
	setWeb3Instance(web3);
	window.web3 = web3 as any; // keep existing global behavior
	return web3;
}

export function clearWeb3() {
	web3Instance.set(null);
	if (typeof window !== 'undefined') {
		(window as any).web3 = null;
	}
}
