pragma solidity >= 0.4.21 < 0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TGE.sol";

contract TestTGE {

    function testInitialBalanceUsingDeployedContract() public {
        TGE tge = TGE(DeployedAddresses.TGE());

        uint expected = 1500000000000000000000000000;

        Assert.equal(
          tge.balanceOf(msg.sender),
          expected,
          "Owner should have 10000 DRCPT initially"
        );
    }
}