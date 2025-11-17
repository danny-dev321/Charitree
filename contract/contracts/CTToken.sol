// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title ChariTree token
/// @author ...
/// @notice Simple fungible token contract for ChariTree
contract CTToken is ERC20, Ownable {
    // properties
    address public cTTreasuryAddress;

    // contructor
    constructor() ERC20("ChariTree", "CTT") Ownable(msg.sender) {
    }

    // events
    event TreasuryAddressSet(address);

    // modifiers

    /// @notice Setting the treasury addess
    function setTreasuryAddress(address _treasuryAddress) onlyOwner public {
        cTTreasuryAddress = _treasuryAddress;
        emit TreasuryAddressSet(_treasuryAddress);
    }

    /// @notice Minting new tokens
    function mint(address beneficiary, uint amount) public {
        require((msg.sender == cTTreasuryAddress),"minting can only be called from the treasury");
        _mint(beneficiary, amount);
    }

}


