# depin-mobile-plan

Decentralized mobile plan smart contract with DePIN integration, backend middleware, and Web3 frontend dashboard.

## Phase 1: Smart Contract Foundation

This repository starts with the blockchain foundation of the mobile plan system:

- Solidity smart contract for data plans and payment logic
- Base Sepolia deployment config
- Hardhat deployment script
- Automated smart contract tests
- Developer documentation for setup and deployment

## Project roadmap

### Phase 1 — Smart contract foundation (current)
- Deployable mobile data plan contract
- Purchase, top-up, status checks, and usage deduction flow
- Test coverage for core behaviors
- Base Sepolia network configuration

### Phase 2 — Middleware / backend bridge
- Event listener for `PlanPurchased` and `DataConsumed`
- Backend service to trigger eSIM or provisioning actions
- Mock telecom simulation for local development
- Webhook support and queueing

### Phase 3 — Frontend wallet dashboard
- Wallet connection via MetaMask or WalletConnect
- Purchase and top-up plan flow
- Real-time status checks
- User experience for DePIN mobile plans

### Phase 4 — Production hardening
- Access control review
- Upgradeable architecture or multi-sig governance review
- Monitoring, alerts, and environment security
- Backend and frontend deployment pipeline

## Tech stack

- Solidity 0.8.20
- Hardhat
- Ethers.js
- Base Sepolia testnet
- MetaMask / wallet integration in upcoming frontend phase

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Set your Base Sepolia values in `.env`.

4. Compile the contract:
   ```bash
   npx hardhat compile
   ```

5. Run the contract tests:
   ```bash
   npx hardhat test
   ```

6. Deploy on Base Sepolia:
   ```bash
   npx hardhat run scripts/deploy.js --network baseSepolia
   ```

## Contract behavior

The `MobileDecentralizedPlan` contract supports:

- `purchasePlan(uint256 _dataInGB)`
- `consumeData(address _user, uint256 _dataUsedBytes)`
- `checkPlanStatus(address _user)`

It stores a per-user mobile data plan with:

- remaining data in bytes
- expiry timestamp
- active/inactive status

## Notes

This is the initial blockchain foundation for a DePIN telecom concept. The next phase will connect contract events to a backend service that can trigger provisioning or eSIM lifecycle actions.
