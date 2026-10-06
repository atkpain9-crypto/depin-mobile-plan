# depin-mobile-plan

Decentralized mobile plan smart contract with DePIN integration, backend middleware, and Web3 frontend dashboard.

## Phase 1: Smart contract foundation

This repository starts with the blockchain foundation of the mobile plan system:

- Solidity smart contract for data plans and payment logic
- Base Sepolia deployment config
- Hardhat deployment script
- Automated smart contract tests
- Developer documentation for setup and deployment

## Phase 2: Backend bridge and telecom middleware

This phase adds a lightweight backend service that listens to on-chain events and triggers a provisioning flow for a DePIN telecom stack.

Included in this phase:

- Express.js server for local and cloud middleware
- Event listener for the deployed contract
- Mock eSIM / telecom provisioning integration service
- Wallet-address plan status lookups via contract calls
- REST endpoints for local testing and automation

## Phase 3: Frontend wallet dashboard

This phase includes a browser-based wallet dashboard for selecting plans, connecting MetaMask, and viewing plan status.

Included in this phase:

- Wallet connection via MetaMask
- Data plan selection and purchase flow
- Real-time status and activity updates
- Configuration via environment variables for the deployed contract

## Project roadmap

### Phase 1 — Smart contract foundation (completed)
- Deployable mobile data plan contract
- Purchase, top-up, status checks, and usage deduction flow
- Test coverage for core behaviors
- Base Sepolia network configuration

### Phase 2 — Middleware / backend bridge (completed)
- Event listener for `PlanPurchased`, `PlanToppedUp`, `DataConsumed`, and `PlanExpired`
- Backend service to trigger eSIM or provisioning actions
- Mock telecom simulation for local development
- Webhook support and queueing

### Phase 3 — Frontend wallet dashboard (completed scaffold)
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
- Express.js
- Vite + vanilla JS dashboard
- Base Sepolia testnet

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

7. Start the backend listener:
   ```bash
   npm run backend:start
   ```

8. Set up the frontend config:
   ```bash
   cd frontend
   cp .env.example .env
   ```

9. Launch the frontend dashboard:
   ```bash
   cd frontend
   npm install
   npm run dev -- --host
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

## Backend service behavior

The middleware watches the contract and reacts to events such as:

- `PlanPurchased`
- `PlanToppedUp`
- `DataConsumed`
- `PlanExpired`

The mock telecom layer handles actions such as:

- activate eSIM profile
- top-up mobile plan provision
- suspend or revoke a profile when the data is exhausted

## Live integration checklist

Before running the frontend against a deployed contract:

- Deploy the contract to Base Sepolia
- Copy the deployed address into `frontend/.env` as `VITE_CONTRACT_ADDRESS`
- Ensure your wallet has Base Sepolia ETH from a faucet
- Keep the backend running at `http://localhost:4000`
- Open the Vite dashboard and connect MetaMask

## Notes

The project now includes a working foundation across blockchain, middleware, and frontend layers. The remaining production work is primarily security review, environment hardening, and live testnet validation.
