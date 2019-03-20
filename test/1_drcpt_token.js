var TGE = artifacts.require("./TGE.sol");
var BN = require("bignumber.js");

const tokens = amount => BN(amount).multipliedBy(10 ** 18);

const increaseTime = addSeconds => {
  const id = Date.now();
  web3.currentProvider.send(
    {
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [addSeconds],
      id: id
    },
    function(err, res) {
      web3.currentProvider.send(
        {
          jsonrpc: "2.0",
          method: "evm_mine",
          id: id + 1
        },
        function() {
          return;
        }
      );
    }
  );
};

contract("TGE", accounts => {
  it("should put 1000000000 TGE in the first account", async function() {
    let tge = await TGE.deployed();
    let tgeCoinBalance = await tge.balanceOf.call(accounts[0]);

    assert.equal(
      tgeCoinBalance.toString(),
      "1500000000000000000000000000",
      "1000000000 wasn't in the first account"
    );
  });
  it("should mark users as transfer agents", async function() {
    let tge = await TGE.deployed();
    await tge.setTransferAgent(accounts[0], true, { from: accounts[0] });
  });
  it("should send coin correctly", async function() {
    // Get initial balances of first and second account.
    let account1 = accounts[0];
    let account2 = accounts[1];

    let amount = 10;

    let tge = await TGE.deployed();
    let account1_starting_balance = new BN(await tge.balanceOf.call(account1));
    let account2_starting_balance = new BN(await tge.balanceOf.call(account2));

    await tge.transfer(account2, amount, { from: account1 });

    let account1_ending_balance = await tge.balanceOf.call(account1);
    let account2_ending_balance = await tge.balanceOf.call(account2);

    assert.equal(
      account1_ending_balance,
      account1_starting_balance.minus(amount).toFixed(),
      "Amount wasn't correctly taken from the sender"
    );
    assert.equal(
      account2_ending_balance,
      account2_starting_balance.plus(amount).toFixed(),
      "Amount wasn't correctly sent to the receiver"
    );
  });
  it("should set release agents", async function() {
    let tge = await TGE.deployed();
    await tge.setReleaseAgent(accounts[1], { from: accounts[0] });
  });
  it("should release coins correctly", async function() {
    let tge = await TGE.deployed();
    await tge.release({ from: accounts[1] });
  });
  it("changes the block timestamp", async function() {
    let block = await web3.eth.getBlock("latest");
    console.log(block.timestamp);
    await increaseTime(60);
  });
  it("verifies change", async function() {
    let block = await web3.eth.getBlock("latest");
    console.log(block.timestamp);
  });
});
