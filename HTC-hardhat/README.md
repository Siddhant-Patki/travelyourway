# HTC-Hardhat — HotelCoin Smart Contract

Solidity smart contract for HotelCoin (HTC), an ERC-20 token used for payments within the TravelYourWay platform. Built with Hardhat and OpenZeppelin.

## Tech Stack

- **Hardhat** — Ethereum development environment
- **Solidity 0.8.20** — smart contract language
- **OpenZeppelin** — ERC-20 and Ownable contract standards
- **TypeScript** — scripts and configuration

## Prerequisites

- Node.js v18+
- MetaMask (to interact with the deployed contract)
- (Optional) [Ganache](https://trufflesuite.com/ganache/) for a local GUI blockchain

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start a local Hardhat node

```bash
npm run node
```

This starts a local Ethereum network at `http://127.0.0.1:8545` with Chain ID `1337`. Keep this terminal running.

### 3. Compile the contract

In a new terminal:

```bash
npm run compile
```

### 4. Deploy the contract

```bash
npm run deploy
```

This deploys `HotelToken` to the local Hardhat network. Copy the deployed contract address and update it in the frontend (`bnb-svelte-firebase-1/src/abi.json`).

### 5. Mint tokens (optional)

```bash
npm run mint
```

Mints HTC tokens to the address configured in `scripts/mint.ts`.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run node` | Start local Hardhat network |
| `npm run compile` | Compile smart contracts |
| `npm run deploy` | Deploy to local Hardhat network |
| `npm run mint` | Mint HTC tokens on localhost |

## Contract: HotelToken (HTC)

- **Standard:** ERC-20
- **Name:** HotelCoin
- **Symbol:** HTC
- **Access:** Only the contract owner (deployer) can mint or burn tokens

## Connecting MetaMask

1. Open MetaMask → Add Network
2. Network Name: `Hardhat Local`
3. RPC URL: `http://127.0.0.1:8545`
4. Chain ID: `1337`
5. Currency Symbol: `ETH`
