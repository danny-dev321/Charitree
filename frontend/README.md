# ChariTree Frontend

A decentralized tree planting donation platform built on Moonbase Alpha (Polkadot).

## Features

- 💰 **Donate DEV tokens** - Support tree planting initiatives and receive CTT tokens
- 📝 **Create Proposals** - Tree planters can submit funding proposals
- 🗳️ **DAO Voting** - DAO members can vote on charity proposals
- 🌳 **Track Impact** - View treasury balance and your contribution

## Tech Stack

- **React** + **TypeScript** - Frontend framework
- **Vite** - Build tool
- **ethers.js v6** - Blockchain interactions
- **TanStack Query** - State management
- **MetaMask** - Wallet connection

## Smart Contract Addresses (Moonbase Alpha)

```
CTToken:    0x86657f4c3E85fcE82E17FABfddEcc6C65E854e69
CTTreasury: 0x499C6cC024d91D3cc497D4197d41b24122c6BFf9
CTDAO:      0x718c18F91ECB572d6ec96bf2d0F2573DaA8a2C50
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Moonbase Alpha DEV tokens (get from [faucet](https://faucet.moonbeam.network/))

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Connect to Moonbase Alpha

1. Open MetaMask
2. Add Moonbase Alpha network:
   - Network Name: Moonbase Alpha
   - RPC URL: https://rpc.api.moonbase.moonbeam.network
   - Chain ID: 1287
   - Currency Symbol: DEV
   - Block Explorer: https://moonbase.moonscan.io/

Or the app will prompt you to add it automatically when you connect.

## Usage

### Donating

1. Connect your wallet
2. Enter amount in mDEV (1000 mDEV = 1 DEV)
3. Click "Donate" and confirm transaction
4. Receive CTT tokens representing your contribution

### Voting (DAO Members Only)

1. Connect wallet (must be DAO member)
2. Navigate to "Proposals" tab
3. Review active proposals
4. Click "Vote" to support a proposal
5. Click "Execute" when proposal has enough votes

### Creating Proposals (DAO Members Only)

1. Connect wallet (must be DAO member)
2. Navigate to "Create Proposal" tab
3. Fill in project details and budget
4. Submit proposal for voting

## Display Format

All amounts are displayed in **mDEV** (milliDEV) for better readability:
- 1000 mDEV = 1.0 DEV
- 100 mDEV = 0.1 DEV
- 10 mDEV = 0.01 DEV

## POC Notes

**Hardcoded Tree Planter**: For this POC, there's a hardcoded tree planter address in `src/config/contracts.ts`. This will be replaced with a proper registration system in production.

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard with tabs
│   ├── WalletConnect.tsx  # Wallet connection button
│   ├── TreasuryStats.tsx  # Display treasury & user stats
│   ├── DonateSection.tsx  # Donation interface
│   ├── ProposalList.tsx   # View and vote on proposals
│   └── CreateProposal.tsx # Create new proposals
├── contexts/
│   └── Web3Context.tsx  # Web3 provider & wallet state
├── config/
│   └── contracts.ts     # Contract addresses & network config
├── utils/
│   └── format.ts        # Formatting utilities (mDEV conversion)
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Building for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

## License

MIT
