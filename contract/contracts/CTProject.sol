// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ChariTree Project template
/// @author ...
/// @notice Project template contract for ChariTree
contract CTProject {
    // properties
    string public projectName;
    address payable public beneficiary;
    address public approver;
    bool public approved;


    // constructor
    constructor(string memory _projectName, address payable _beneficiary, address _approver){  
        projectName = _projectName;
        beneficiary = _beneficiary;
        approver = _approver;
    }

    // modifiers
    modifier onlyApprover{
        require((msg.sender == approver));
        _;
    }

    modifier onlyBeneficiare{
        require((msg.sender == beneficiary));
        _;
    }

    /// @notice Returns the current ETH balance of the treasury
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // defining project template as payable
    receive() external payable {
    }

    // approve payout 
    function approve() onlyApprover public {
        approved = true;
    }

    // beneficiary can claim the funds if approved
    function claim() public {
        require ((approved == true),"claim works only if approved");
        require ((beneficiary == msg.sender),"only beneficiary can claim");
        beneficiary.transfer(getBalance());
    }
}