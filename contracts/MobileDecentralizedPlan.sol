// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MobileDecentralizedPlan {
    uint256 public constant DATA_UNIT = 1_024 * 1_024 * 1_024;
    uint256 public constant PLAN_DURATION = 30 days;
    uint256 public constant COST_PER_GB = 0.005 ether;

    struct MobilePlan {
        uint256 dataBalanceBytes;
        uint256 expiryTimestamp;
        bool isActive;
    }

    mapping(address => MobilePlan) public userPlans;
    address public provider;

    event PlanPurchased(address indexed user, uint256 dataAmountGB, uint256 expiryTimestamp);
    event PlanToppedUp(address indexed user, uint256 addedDataGB, uint256 expiryTimestamp);
    event DataConsumed(address indexed user, uint256 dataUsedBytes, uint256 remainingDataBytes);
    event PlanExpired(address indexed user);

    modifier onlyProvider() {
        require(msg.sender == provider, "Not authorized provider");
        _;
    }

    constructor() {
        provider = msg.sender;
    }

    function purchasePlan(uint256 _dataInGB) external payable {
        require(_dataInGB > 0, "Data amount must be > 0");
        require(msg.value == _dataInGB * COST_PER_GB, "Incorrect payment amount");

        uint256 dataBytes = _dataInGB * DATA_UNIT;
        MobilePlan storage plan = userPlans[msg.sender];

        if (plan.isActive && block.timestamp < plan.expiryTimestamp) {
            plan.dataBalanceBytes += dataBytes;
            plan.expiryTimestamp += PLAN_DURATION;
            emit PlanToppedUp(msg.sender, _dataInGB, plan.expiryTimestamp);
            return;
        }

        plan.dataBalanceBytes = dataBytes;
        plan.expiryTimestamp = block.timestamp + PLAN_DURATION;
        plan.isActive = true;

        emit PlanPurchased(msg.sender, _dataInGB, plan.expiryTimestamp);
    }

    function consumeData(address _user, uint256 _dataUsedBytes) external onlyProvider {
        require(_dataUsedBytes > 0, "Data used must be > 0");

        MobilePlan storage plan = userPlans[_user];
        require(plan.isActive, "No active plan");
        require(block.timestamp <= plan.expiryTimestamp, "Plan expired");
        require(plan.dataBalanceBytes >= _dataUsedBytes, "Insufficient balance");

        plan.dataBalanceBytes -= _dataUsedBytes;

        if (plan.dataBalanceBytes == 0) {
            plan.isActive = false;
            emit PlanExpired(_user);
        }

        emit DataConsumed(_user, _dataUsedBytes, plan.dataBalanceBytes);
    }

    function checkPlanStatus(address _user) external view returns (bool active, uint256 remainingGB, uint256 timeLeft) {
        MobilePlan memory plan = userPlans[_user];

        if (!plan.isActive || block.timestamp >= plan.expiryTimestamp) {
            return (false, 0, 0);
        }

        return (true, plan.dataBalanceBytes / DATA_UNIT, plan.expiryTimestamp - block.timestamp);
    }
}
