const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MobileDecentralizedPlan", function () {
  let contract;
  let owner;
  let user;
  let provider;

  beforeEach(async function () {
    [owner, user, provider] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory("MobileDecentralizedPlan");
    contract = await ContractFactory.deploy();
    await contract.waitForDeployment();
  });

  it("should allow a user to purchase a new plan", async function () {
    const dataInGB = 5n;
    const payment = ethers.parseEther("0.025");

    await expect(
      contract.connect(user).purchasePlan(dataInGB, { value: payment })
    )
      .to.emit(contract, "PlanPurchased")
      .withArgs(user.address, dataInGB, await contract.userPlans(user.address).then((plan) => plan.expiryTimestamp));

    const [active, remainingGB] = await contract.checkPlanStatus(user.address);

    expect(active).to.equal(true);
    expect(remainingGB).to.equal(dataInGB);
  });

  it("should reject incorrect payment amounts", async function () {
    await expect(
      contract.connect(user).purchasePlan(5n, { value: ethers.parseEther("0.01") })
    ).to.be.revertedWith("Incorrect payment amount");
  });

  it("should allow a top up for an active plan", async function () {
    await contract.connect(user).purchasePlan(2n, { value: ethers.parseEther("0.01") });

    await contract.connect(user).purchasePlan(3n, { value: ethers.parseEther("0.015") });

    const [active, remainingGB] = await contract.checkPlanStatus(user.address);

    expect(active).to.equal(true);
    expect(remainingGB).to.equal(5n);
  });

  it("should deduct data when a provider consumes it", async function () {
    await contract.connect(user).purchasePlan(2n, { value: ethers.parseEther("0.01") });

    await contract.connect(owner).consumeData(user.address, 500n * 1024n * 1024n);

    const [active, remainingGB] = await contract.checkPlanStatus(user.address);
    expect(active).to.equal(true);
    expect(remainingGB).to.equal(1n);
  });

  it("should fail if a provider tries to consume more data than available", async function () {
    await contract.connect(user).purchasePlan(1n, { value: ethers.parseEther("0.005") });

    await expect(
      contract.connect(owner).consumeData(user.address, 2n * 1024n * 1024n * 1024n)
    ).to.be.revertedWith("Insufficient balance");
  });
});
