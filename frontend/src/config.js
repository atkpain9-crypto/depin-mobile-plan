export const APP_CONFIG = {
  contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  rpcUrl: import.meta.env.VITE_RPC_URL || 'https://sepolia.base.org',
  chainId: Number(import.meta.env.VITE_CHAIN_ID || 84532),
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000',
};
