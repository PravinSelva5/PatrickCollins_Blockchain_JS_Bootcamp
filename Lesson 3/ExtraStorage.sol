// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

// Inheritance used by inheriting all the functionality of simple storage
// If you want to override a function from the parent contract, the function in the parent contract needs to have the keyword 'virtual'
contract ExtraStorage is SimpleStorage {
    function store(uint256 _favoriteNumber) public override {
        favoriteNumber = _favoriteNumber + 5;
    }
}
