# BnB Frontend — SvelteKit + Firebase + Web3

The main user-facing application for the TravelYourWay platform. Users can browse listings, make reservations, and pay with HotelCoin (HTC) tokens.

## Tech Stack

- **SvelteKit** — full-stack Svelte framework
- **Firebase** — Firestore database + Authentication
- **Web3.js / Moralis** — wallet connection and token interaction
- **TailwindCSS + shadcn-svelte** — UI components

## Prerequisites

- Node.js v18+
- A Firebase project with Firestore and Authentication enabled
- MetaMask installed in your browser
- HTC-hardhat local node running (for Web3 features)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

Open `src/lib/firebase.ts` and replace the Firebase config values with your own project credentials from the [Firebase Console](https://console.firebase.google.com/).

### 3. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check` | Run Svelte type checker |
| `npm run format` | Format code with Prettier |

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home — browse listings |
| `/rooms/[id]` | Individual room detail page |
| `/new-bnb` | Create a new listing |
| `/reservations` | View your reservations |
| `/profile` | User profile |
