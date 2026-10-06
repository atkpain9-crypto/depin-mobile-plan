import { createApp } from 'vue';
import './style.css';

createApp({
  data() {
    return {
      connected: false,
      wallet: '',
      selectedGB: 1,
      status: { active: false, remainingGB: 0, timeLeft: 0 },
      activity: ['Waiting for wallet connection…'],
      contractAddress: '0x0000000000000000000000000000000000000000',
    };
  },
  methods: {
    async connectWallet() {
      if (!window.ethereum) {
        this.activity.unshift('MetaMask not detected.');
        return;
      }

      try {
        const provider = new window.ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        this.wallet = await signer.getAddress();
        this.connected = true;
        this.activity.unshift(`Connected wallet: ${this.wallet.slice(0, 8)}...`);
      } catch (error) {
        this.activity.unshift('Wallet connection failed');
        console.error(error);
      }
    },
    async refreshStatus() {
      this.activity.unshift('Refreshing plan status…');
    },
    async buyPlan() {
      if (!this.connected) {
        this.activity.unshift('Connect wallet before purchasing a plan.');
        return;
      }
      this.activity.unshift(`Plan purchase requested for ${this.selectedGB} GB`);
    },
  },
}).mount('#app');
