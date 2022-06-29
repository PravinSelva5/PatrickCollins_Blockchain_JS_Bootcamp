// The goal of this smart contract is to:
//      1. Get funds from users
//      2. Withdraw funds
//      3. Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract FundMe {

    uint256 public minimumUSD = 50;
    // to send a token through a function, the keyword payable is needed.
    function fund() public payable {
        // Anyone should be able to fund this contract which is why the public keyword is used.
        // Money math is done in terms of wei, so 1 ETH needs to be set as 1e18 value
        // keyword msg.value isused to identify how much ETH the sender has sent to the contract.
            require(msg.value > minimumUSD, "Didnt'send enough!");  
 
    }

    function getPrice() public {
        // Becuase this function is attempting to interact with a contract outsie this contract. There are two things that are needed:
        //      1. ABI
        //      2. Address 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
    }

    function getConversionRate() public{

    }

    // function withdraw(){

    // }


}