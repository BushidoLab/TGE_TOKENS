const TGE = artifacts.require("./TGE.sol");

module.exports = deployer => {
  deployer.deploy(TGE, "Token Generating Event", "TGE", 18, 1500000000);
};
