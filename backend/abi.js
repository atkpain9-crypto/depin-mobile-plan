const MobilePlanAbi = [
  "function provider() view returns (address)",
  "function purchasePlan(uint256 _dataInGB) payable",
  "function consumeData(address _user, uint256 _dataUsedBytes)",
  "function checkPlanStatus(address _user) view returns (bool active, uint256 remainingGB, uint256 timeLeft)",
  "function userPlans(address) view returns (uint256 dataBalanceBytes, uint256 expiryTimestamp, bool isActive)",
  "event PlanPurchased(address indexed user, uint256 dataAmountGB, uint256 expiryTimestamp)",
  "event PlanToppedUp(address indexed user, uint256 addedDataGB, uint256 expiryTimestamp)",
  "event DataConsumed(address indexed user, uint256 dataUsedBytes, uint256 remainingDataBytes)",
  "event PlanExpired(address indexed user)"
];

module.exports = { MobilePlanAbi };
