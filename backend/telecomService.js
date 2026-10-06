const { EventEmitter } = require("events");

class TelecomProvisioningService extends EventEmitter {
  constructor() {
    super();
    this.mode = process.env.PROVISIONING_MODE || "mock";
    this.pending = [];
  }

  async handlePlanEvent(eventName, payload) {
    const actionMap = {
      PlanPurchased: "activate",
      PlanToppedUp: "topup",
      DataConsumed: "sync",
      PlanExpired: "revoke",
    };

    const action = actionMap[eventName] || "sync";
    const record = {
      eventName,
      wallet: payload.user || payload.wallet || "unknown",
      action,
      status: "queued",
      mode: this.mode,
      dataUsedBytes: payload.dataUsedBytes || null,
      dataAmountGB: payload.dataAmountGB || null,
      timestamp: new Date().toISOString(),
    };

    this.pending.push(record);
    this.emit("provisioning-event", record);

    if (this.mode === "mock") {
      return {
        ...record,
        status: "completed",
        provider: "mock-esim-provider",
        message: `${eventName} handled in mock provisioning mode`,
      };
    }

    return {
      ...record,
      status: "forwarded",
      provider: "depin-provisioner",
      message: `Event forwarded for real-world telecom provisioning`,
    };
  }

  getPendingEvents() {
    return this.pending;
  }
}

module.exports = { TelecomProvisioningService };
