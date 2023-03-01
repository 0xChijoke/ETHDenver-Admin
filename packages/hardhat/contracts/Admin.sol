// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Admin {
    address public owner;
    mapping (address => bool) public authorized;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    function addAuthorized(address _addr) public onlyOwner {
        authorized[_addr] = true;
    }

    function removeAuthorized(address _addr) public onlyOwner {
        authorized[_addr] = false;
    }

    function isAuthorized(address _addr) public view returns (bool) {
        return authorized[_addr];
    }

    function getAuthorized() public view returns (address[] memory) {
        address[] memory authorizedAddresses = new address[](0);
        for (uint i = 0; i < authorized.length; i++) {
            if (authorized[i]) {
                authorizedAddresses.push(i);
            }
        }
        return authorizedAddresses;
    }
}