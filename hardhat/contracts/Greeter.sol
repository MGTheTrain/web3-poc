// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Greeter {
    string private greeting;

    // Event that will be emitted when the greeting is updated
    event GreetingUpdated(string newGreeting);

    // Constructor that sets the initial greeting
    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    // Function to set a new greeting
    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
        emit GreetingUpdated(_greeting);
    }

    // Function to get the current greeting
    function greet() public view returns (string memory) {
        return greeting;
    }
}
