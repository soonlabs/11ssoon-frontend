# 11sSoon Solana Price Prediction (x402)

A minimal front-end for a Solana-based price prediction game using the x402 payment protocol:

- Predict SOL price movement in 11 seconds
- Pay 1 USDC to place a prediction
- If correct, mint 1 $11s token; if incorrect, you lose 1 USDC

This project focuses on clean UI, predictable state, and a reusable x402 client for paid API endpoints.

## Features

- Solana wallet connect via AppKit (WalletConnect)
- x402 protocol payment flow (client + interceptor)
- Real-time price polling (React Query)
- Betting lifecycle UI (betting → countdown → settling → result)
- Responsive UI with modern styling

## Tech Stack

- React + TypeScript
- Vite
- @tanstack/react-query
- WalletConnect AppKit (Solana)
- x402 protocol client (customized for Solana)

## Architecture Overview

- `src/config/` centralizes environment-specific configuration (API base URL, network, RPC, addresses).
- `src/lib/x402-solana/` implements a small, reusable x402 client for Solana and a fetch interceptor.
- `src/hooks/` encapsulates data-fetching, polling, and business-state logic (e.g., bet list, countdown).
- `src/pages/Home/` contains the main UI composition: header, dashboard, actions, result, footer.
- `src/store/` manages UI and business state via small global stores (Zustand).

High-level data flow:

1. User connects a Solana wallet (AppKit).
2. User places a bet (1 USDC) using the x402 payment-enabled request.
3. UI enters countdown, polls current price, and moves to settling.
4. The result is shown, and UI resets after a short delay.

## Directory Structure

```
src/
  api/                 # API endpoints composed from config.API_BASE_URL
  assets/              # Images and icons
  components/          # Reusable UI components
  config/              # common, development, production, index (merging logic)
  hooks/               # Custom hooks: prices, bet, round, wallets, x402
  lib/x402-solana/     # x402 client, types, utils for Solana
  pages/Home/          # Main page UI modules
  store/               # Global state stores (Zustand)
  utils/               # Solana helpers, formatting, etc.
```

## Setup

```bash
yarn install
```

## Development

```bash
yarn dev
```

This runs the Vite dev server with hot reload.

## Build

```bash
yarn build
```

Outputs to `dist/`.

## Preview (Local)

```bash
yarn preview
```

## Deployment

- The app is a static site built by Vite. It can be deployed to Vercel/Netlify/Cloudflare Pages.
- This repo includes `vercel.json` (single-page-app rewrites and security header).
- If deploying to Vercel with branches, `src/config/index.ts` contains logic to pick environment config by branch name.

## Acknowledgements

- WalletConnect AppKit for Solana
- x402 protocol libraries
