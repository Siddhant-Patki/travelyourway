# BnB Admin — React + Refine + Firebase

Admin dashboard for the TravelYourWay platform. Manage listings and reservations through a full CRUD interface powered by Refine and Firebase.

## Tech Stack

- **React** — UI library
- **Refine** — admin framework for CRUD operations
- **Ant Design** — UI component library
- **Firebase** — Firestore as the data provider
- **Vite** — build tool

## Prerequisites

- Node.js v18+
- A Firebase project with Firestore enabled
- Refine CLI: `npm install -g @refinedev/cli`

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

The admin panel will be available at `http://localhost:5173`.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Features

- **Listings** — create, view, edit, and delete BnB listings
- **Reservations** — manage all guest reservations
