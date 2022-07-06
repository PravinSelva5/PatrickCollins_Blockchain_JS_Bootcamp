// SPDX-License-Identifier: MIT

pragma solidity 0.8.7; // ^ sign can be used in front of the verison, ^0.8.7 to let the compiler know any version higher than the one specified can be used.

contract SimpleStorage {
    // Primitive Data Types: boolean, uint, int, address, bytes
    // Default value for an undeclared uint256 is 0
    uint256 favoriteNumber;

    mapping(string => uint256) public nameToFavoriteNumer;

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    // uint256[] public favoriteNumbersList
    // Below is a dynamic array because the size of the array isn't given at initialization
    People[] public people;

    function store(uint256 _favoriteNumber) public {
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        people.push(People(_favoriteNumber, _name));
        nameToFavoriteNumer[_name] = _favoriteNumber;
    }
}

// Every single smart contract has an address just like how our wallets have their dedicated addresses.
// A public variable implicitly get assigned a function that returns its value!
// Without stating the visibility, such as 'public', the default is 'internal'

// view and pure functions, when called alone, DON'T SPEND GAS. This is because there is no modification to the STATE of the blockchain. ONLY for reading the blockchain.
// if a GAS calling function calls a VIEW or PURE function, only then will it cost gas

// EVM Overview
//   - EVM can access and store information in six places:
//      - Stack, Memory, Storage, Calldata, Code, and Logs

// Calldata
//  - the variable will only exist in memory temporarily

// Memory
//  - the variable will only exist in memory temporarily

// Storage

// Basic Solidity Mapping
//  - a DS where a ky is 'mapped' to a single value
