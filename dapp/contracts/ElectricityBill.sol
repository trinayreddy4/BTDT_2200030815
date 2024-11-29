// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ElectricityBill {
    address public owner;
    uint256 public ratePerUnit;  // Cost per unit of electricity

    // Structure to store user bill data
    struct Bill {
        uint256 previousReading;
        uint256 currentReading;
        uint256 unitsUsed;
        uint256 billAmount;
    }

    mapping(address => Bill) public bills;

    event BillGenerated(address indexed user, uint256 unitsUsed, uint256 billAmount);

    constructor(uint256 _ratePerUnit) {
        owner = msg.sender;
        ratePerUnit = _ratePerUnit;
    }

    // Function to generate bill based on readings
    function generateBill(uint256 previousReading, uint256 currentReading) public {
        require(currentReading >= previousReading, "Invalid meter readings");

        uint256 unitsUsed = currentReading - previousReading;
        uint256 billAmount = unitsUsed * ratePerUnit;

        bills[msg.sender] = Bill(previousReading, currentReading, unitsUsed, billAmount);
        emit BillGenerated(msg.sender, unitsUsed, billAmount);
    }

    // Function to get the bill details
    function getBill() public view returns (Bill memory) {
        return bills[msg.sender];
    }
}
