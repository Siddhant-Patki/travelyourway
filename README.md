# TravelYourWay

A full-stack Web3-enabled BnB (Airbnb-like) platform with a Svelte frontend, React admin panel, and Hardhat smart contract setup.

## Project Structure

```
travelyourway/
├── bnb-svelte-firebase-1/   # Main frontend app (SvelteKit + Firebase + Web3)
├── bnb-admin/               # Admin dashboard (React + Refine + Firebase)
└── HTC-hardhat/             # Smart contracts (Hardhat + Solidity)
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- [MetaMask](https://metamask.io/) browser extension (for Web3 features)
- A Firebase project with Firestore and Authentication enabled

## Quick Start

Run each sub-project in a separate terminal. See each folder's README for detailed setup.

### 1. Start the Smart Contract Node

```bash
cd HTC-hardhat
npm install
npm run node
```

### 2. Start the Admin Panel

```bash
cd bnb-admin
npm install
npm run dev
```

### 3. Start the Frontend App

```bash
cd bnb-svelte-firebase-1
npm install
npm run dev
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | SvelteKit, TailwindCSS, Firebase, Web3.js |
| Admin | React, Refine, Ant Design, Firebase |
| Blockchain | Hardhat, Solidity, OpenZeppelin, Ganache |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
