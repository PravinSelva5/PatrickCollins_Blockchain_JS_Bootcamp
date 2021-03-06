// The goal of this smart contract is to:
//      1. Get funds from users
//      2. Withdraw funds
//      3. Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    address public immutable i_owner;

    constructor() {
        // owner will be whomever deployed this contract
        i_owner = msg.sender;
    }

    // to send a token through a function, the keyword payable is needed.
    function fund() public payable {
        // Anyone should be able to fund this contract which is why the public keyword is used.
        // Money math is done in terms of wei, so 1 ETH needs to be set as 1e18 value
        // keyword msg.value isused to identify how much ETH the sender has sent to the contract. The amount is stored in wei.
        require(
            msg.value.getConversionRate() >= MINIMUM_USD,
            "Didnt'send enough!"
        );
        funders.push(msg.sender); // msg.sender contains the address of the sender that is funding the contract
        addressToAmountFunded[msg.sender] += msg.value;
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

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        // reset the array
        funders = new address[](0); // 0 indicates that this is a blank array

        // There are three ways funds can be withdrawn: 1. transfer 2. send 3. call

        // 1. transfer
        // msg.sender = address
        // payable(msg.sender) = payable address
        payable(msg.sender).transfer(address(this).balance);

        // 2. send
        // If there is an error in the send call, it will not return an error but a bool value
        bool sendSuccess = payable(msg.sender).send(address(this).balance);
        require(sendSuccess, "Send Failed");

        // 3. call
        // Bytes objects are arrays, so the returned data needs to be stored in memory
        // Because of the below code, we aren't calling a function, so we don't care about the returned data. Which is why 'bytes memory dataReturned' is removed.
        // As of right now, 7/04/2022, call method is the recommended way to actually send & receive ETH or ETH based tokens.
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call Failed");
    }

    modifier onlyOwner() {
        //require(msg.sender == i_owner, "Sender is not owner!");
        if (msg.sender != i_owner) {
            revert NotOwner();
        } // more gas efficient than require statement
        _;
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
