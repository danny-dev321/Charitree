// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ChariTree Project template
/// @author ...
/// @notice Project template contract for ChariTree
contract CTProject {
    // properties
    string public projectName;
    address public beneficiary;

    // constructor
    constructor(string memory _projectName, address _beneficiary){  
        projectName = _projectName;
        beneficiary = _beneficiary;
    }

    /// @notice Returns the current ETH balance of the treasury
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

}