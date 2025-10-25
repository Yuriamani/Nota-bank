// contracts/HelloHedera.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract HelloHedera {
    string public greeting = "Hello from Hedera!";

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
}
