// The goal of this smart contract is to:
//      1. Get funds from users
//      2. Withdraw funds
//      3. Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract FundMe {
    uint256 public minimumUSD = 50 * 1e18;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    // to send a token through a function, the keyword payable is needed.
    function fund() public payable {
        // Anyone should be able to fund this contract which is why the public keyword is used.
        // Money math is done in terms of wei, so 1 ETH needs to be set as 1e18 value
        // keyword msg.value isused to identify how much ETH the sender has sent to the contract. The amount is stored in wei.
        require(msg.value > minimumUSD, "Didnt'send enough!");
        funders.push(msg.sender); // msg.sender contains the address of the sender that is funding the contract
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function getPrice() public view returns (uint256) {
        // Becuase this function is attempting to interact with a contract outsie this contract. There are two things that are needed:
        //      1. ABI
        //      2. Address 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        // ETH in terms of USD
        return uint256(price * 1e10);
    }

    function getVersion() public view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        );
        return priceFeed.version();
    }

    function getConversionRate(uint256 ethAmount)
        public
        view
        returns (uint256)
    {
        uint256 ethPrice = getPrice();
        // With solidity, you always want to multiply first and then divide
        uint256 ethAmountInUSD = (ethPrice * ethAmount) / 1e18;

        return ethAmountInUSD;
    }

    // function withdraw(){

    // }
}
