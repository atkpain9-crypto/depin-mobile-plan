const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const { MobilePlanAbi } = require("./abi");
const { TelecomProvisioningService } = require("./telecomService");

require("dotenv").config();

const app = express();
const port = Number(process.env.PORT) || 4000;
const contractAddress = process.env.CONTRACT_ADDRESS;

if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
  console.warn("CONTRACT_ADDRESS is not configured. Backend will run in demo mode until a contract is deployed.");
}

app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org");
const telecomService = new TelecomProvisioningService();

const createContract = () => {
  if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
    return null;
  }

  return new ethers.Contract(contractAddress, MobilePlanAbi, provider);
};

app.get("/health", async (req, res) => {
  try {
    const network = await provider.getNetwork();
    res.json({
      ok: true,
      network: network.name,
      chainId: Number(network.chainId),
      contractAddress: contractAddress || null,
      mode: process.env.PROVISIONING_MODE || "mock",
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

app.get("/api/status/:address", async (req, res) => {
  const { address } = req.params;
  const contract = createContract();

  if (!ethers.isAddress(address)) {
    return res.status(400).json({ message: "Invalid wallet address" });
  }

  if (!contract) {
    return res.status(503).json({
      message: "Contract not configured. Deploy the smart contract before requesting status.",
    });
  }

  try {
    const [active, remainingGB, timeLeft] = await contract.checkPlanStatus(address);
    res.json({
      address,
      active,
      remainingGB: Number(remainingGB),
      timeLeft: Number(timeLeft),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/mock/provisioning", async (req, res) => {
  const { wallet, action, eventName, dataAmountGB, dataUsedBytes } = req.body;

  if (!wallet) {
    return res.status(400).json({ message: "wallet is required" });
  }

  const payload = {
    wallet,
    eventName: eventName || action || "PlanPurchased",
    dataAmountGB,
    dataUsedBytes,
  };

  const result = await telecomService.handlePlanEvent(payload.eventName, payload);
  res.json({ ok: true, result });
});

app.get("/api/provisioning/history", (req, res) => {
  res.json({
    ok: true,
    records: telecomService.getPendingEvents(),
  });
});

const listenForContractEvents = async () => {
  const contract = createContract();

  if (!contract) {
    console.log("Listening disabled: smart contract address not configured.");
    return;
  }

  const eventNames = ["PlanPurchased", "PlanToppedUp", "DataConsumed", "PlanExpired"];

  for (const eventName of eventNames) {
    contract.on(eventName, async (...args) => {
      const event = args[args.length - 1];
      const payload = {
        user: event.args?.user || args[0],
        dataAmountGB: event.args?.dataAmountGB || null,
        addedDataGB: event.args?.addedDataGB || null,
        dataUsedBytes: event.args?.dataUsedBytes || null,
        remainingDataBytes: event.args?.remainingDataBytes || null,
      };

      console.log(`Received ${eventName} event`, payload);
      const result = await telecomService.handlePlanEvent(eventName, payload);
      console.log("Provisioning response:", result);
    });
  }

  console.log(`Event listener active for contract ${contractAddress}`);
};

listenForContractEvents();

app.listen(port, () => {
  console.log(`Backend middleware running on http://localhost:${port}`);
});
