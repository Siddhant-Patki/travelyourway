import Web3 from 'web3';
import abi from '../abi.json';

// Declare global ethereum/web3 on window
declare global {
	interface Window {
		ethereum?: any;
		web3?: any;
	}
}

// Ganache deployed contract address
export const CONTRACT_ADDRESS = '0x09d1e4B23E723e4b968e58e33fDe50e7891f7E05';

// Local block explorer base URL
export const EXPLORER_URL = 'http://localhost:5100';

// Deployer address — the one that can call mint()
export const DEPLOYER_ADDRESS = '0xA3632DD16d760a8eE6ec3Baf8566206a50A49B25';

// Get contract instance
export function getContract() {
	const web3 = new Web3(window.ethereum);
	return new web3.eth.Contract(abi as any, CONTRACT_ADDRESS);
}

// Mint HTC tokens to a user's wallet
export async function mintToken(toAddress: string, amount: number): Promise<string | null> {
	try {
		const web3 = new Web3(window.ethereum);
		const contract = getContract();
		const amountInWei = web3.utils.toWei(amount.toString(), 'ether');

		console.log(`Minting ${amount} HTC to ${toAddress}`);

		const receipt = await contract.methods
			.mint(toAddress, amountInWei)
			.send({ from: DEPLOYER_ADDRESS });

		console.log('Mint tx hash:', receipt.transactionHash);
		return receipt.transactionHash;
	} catch (error: any) {
		console.error('Mint failed:', error.message);
		return null;
	}
}


// Burn address — tokens sent here are gone forever, no one owns this address
const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD';

// Burn HTC tokens — transfer to dead address so MetaMask shows -HTC in activity
export async function burnToken(fromAddress: string, amount: number): Promise<string | null> {
	try {
		const web3 = new Web3(window.ethereum);
		const contract = getContract();
		const amountInWei = web3.utils.toWei(amount.toString(), 'ether');

		console.log(`Burning ${amount} HTC from ${fromAddress} → dead address`);

		const receipt = await contract.methods
			.transfer(BURN_ADDRESS, amountInWei)
			.send({ from: fromAddress });

		console.log('Burn tx hash:', receipt.transactionHash);
		return receipt.transactionHash;
	} catch (error: any) {
		console.error('Token burn failed:', error.message);
		return null;
	}
}

// Get HTC balance of a wallet address
export async function getHtcBalance(address: string): Promise<string> {
	try {
		const web3 = new Web3(window.ethereum);
		const contract = getContract();
    const balance = await contract.methods.balanceOf(address).call() as string;
		return parseFloat(web3.utils.fromWei(balance as string, 'ether')).toFixed(2);
	} catch (error: any) {
		console.error('Balance check failed:', error.message);
		return '0';
	}
}

// Calculate reward tokens — 50% of booking price
export function calculateReward(bookingPrice: number): number {
	return Math.floor(bookingPrice * 0.5);
}