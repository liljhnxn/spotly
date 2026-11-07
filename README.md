# Spotly 🧭

> **Find Places. Share Experiences.**

Spotly is a decentralized, travel-magazine-inspired place-discovery Web3 platform where users share interesting places, hidden gems, and locations worth visiting. All submissions and favourites are stored directly and immutably on-chain.

Built on **Botchain Testnet** (Chain ID: 968).

---

## 🌟 Key Features

- **Decentralized Architecture**: Exactly one Solidity smart contract (`Spotly.sol`) and exactly one webpage (`app/page.tsx`). No centralized backend, no external databases, and no token/NFT gating.
- **On-Chain Place Submissions**: Submit places with a title, geographical location, narrative description, category, and optional photo link.
- **On-Chain Favourites**: Save and unsave favorite places with duplicate prevention enforced by smart contract logic.
- **Author Permissions**: Authors retain the right to remove their own submissions anytime on-chain.
- **Real-Time Counters**: Live metrics tracking total active places and total community favourites across the network.
- **Editorial Travel-Discovery Aesthetic**:
  - Background: `#101820` (Deep Navy)
  - Cards: `#1B2935` (Navy Glass)
  - Primary Accent: `#56B4E9` (Sky Blue)
  - Secondary Accent: `#FF776B` (Coral Action)
  - Text: `#F7FAFC`
- **Categorization**: Filter through *Restaurants*, *Nature*, *Hotels*, *Entertainment*, and *Hidden Gems*.
- **Personal Travel Hub**: "My Places" and "My Favourites" views to manage your submissions and saved wishlist.
- **Live Notifications**: Status toasts for pending wallet confirmations, transaction broadcast receipts, and direct links to BohrScan.

---

## ⛓️ Network Specifications

| Parameter | Value |
|---|---|
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC Endpoint** | `https://rpc.bohr.life` |
| **Block Explorer** | `https://scan.bohr.life` |
| **Currency Symbol** | `BOHR` |

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router, Single Page)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3 Wallet & State**: wagmi v2, viem v2, @tanstack/react-query
- **Smart Contracts**: Solidity `^0.8.20`
- **Development Environment**: Hardhat

---

## 📁 Repository Structure

```
Spotly/
├── contracts/
│   └── Spotly.sol             # Exactly one Solidity smart contract
├── scripts/
│   └── deploy.ts              # Hardhat deployment script for Botchain Testnet
├── test/
│   └── Spotly.test.ts         # Comprehensive Hardhat contract tests
├── src/
│   ├── app/
│   │   ├── globals.css        # Premium dark travel discovery theme & utilities
│   │   ├── layout.tsx         # Root layout with Wagmi & React Query providers
│   │   └── page.tsx           # Exactly one webpage (all discovery & management)
│   ├── components/
│   │   ├── AddPlaceModal.tsx   # Modal with live photo preview & form validation
│   │   ├── CategoryFilter.tsx  # Category pills & tab switches
│   │   ├── Hero.tsx            # Magazine-style headline & live stats counters
│   │   ├── Navbar.tsx          # Branding, network indicator & MetaMask connection
│   │   ├── PlaceCard.tsx       # Location card with image preview, fav toggle & delete
│   │   ├── Providers.tsx       # WagmiProvider + QueryClientProvider wrapper
│   │   └── Toast.tsx           # Transaction notifications with explorer links
│   ├── config/
│   │   ├── chain.ts            # Custom chain definition for Botchain Testnet (968)
│   │   ├── contract.ts         # Exported active contract address resolver
│   │   └── wagmi.ts            # Wagmi client configuration
│   ├── contracts/
│   │   ├── SpotlyABI.ts        # Typed TypeScript ABI for Wagmi
│   │   └── deployedAddress.json# Auto-generated deployment metadata
│   └── types/
│       └── place.ts            # Place interface & category types
├── hardhat.config.ts          # Hardhat configuration with Botchain network
├── tailwind.config.ts         # Color palette (#101820, #1B2935, #56B4E9, #FF776B)
├── tsconfig.json              # TypeScript configuration
├── package.json
└── .env.example
```

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [MetaMask](https://metamask.io/) browser extension

### 2. Installation

```bash
git clone <repo-url>
cd Spotly
npm install
```

### 3. Environment Setup

Create `.env.local` based on `.env.example`:

```bash
cp .env.example .env.local
```

Fill in your configuration:
```env
NEXT_PUBLIC_CHAIN_ID=968
NEXT_PUBLIC_RPC_URL=https://rpc.bohr.life
NEXT_PUBLIC_EXPLORER_URL=https://scan.bohr.life
NEXT_PUBLIC_CONTRACT_ADDRESS=<YOUR_DEPLOYED_CONTRACT_ADDRESS>

# Required only for deploying the smart contract:
PRIVATE_KEY=<YOUR_PRIVATE_KEY>
```

---

## 🧪 Smart Contract Testing & Deployment

### Run Unit Tests
```bash
npm test
```
Tests verify:
- Place submission (with and without optional image URLs)
- Field validations (reverts on empty name, location, description, category)
- Favouriting & unsaving logic
- Duplicate favourite prevention (`AlreadyFavourited`)
- Place removal by author and permission checks (`NotPlaceAuthor`)
- Historical and active place counter accuracy
- Event emissions (`PlaceSubmitted`, `PlaceFavourited`, `PlaceUnfavourited`, `PlaceRemoved`)

### Compile Contract
```bash
npm run compile
```

### Deploy to Botchain Testnet
```bash
npm run deploy:botchain
```
The script will deploy `Spotly.sol` to Botchain Testnet, print the explorer address, and automatically write the address to `src/contracts/deployedAddress.json`.

---

## 💻 Running the Web Application

Start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🦊 Connecting MetaMask to Botchain Testnet

To interact with the app, ensure your MetaMask wallet includes the Botchain Testnet:
- **Network Name**: Botchain Testnet
- **New RPC URL**: `https://rpc.bohr.life`
- **Chain ID**: `968`
- **Currency Symbol**: `BOHR`
- **Block Explorer URL**: `https://scan.bohr.life`

The app also features automatic network detection and prompts you to switch with a single click if connected to another network.

---

## 📄 License

MIT

