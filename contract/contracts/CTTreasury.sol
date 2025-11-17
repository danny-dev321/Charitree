// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CTToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ChariTree Treasury Contract
/// @author ...
/// @notice Treasury contract for ChariTree
contract CTTreasury is Ownable {
    // exchange rate ETH for token
    uint public exchangeRate;
    address public cTokenAddress;
    address public cDAOAddress;

    constructor(uint _exchangeRate, address _cTokenAddress) Ownable(msg.sender) {
        exchangeRate = _exchangeRate;
        cTokenAddress = _cTokenAddress;
    }

    // Events for logging
    event Donated(address indexed from, uint256 amount);
    event DAOAddressSet(address daoAddress);

    /// @notice Returns the current ETH balance of the treasury
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Returns the current ETH balance of the treasury
    function setDAOAddres(address _newDAOAddress) onlyOwner() public {
        cDAOAddress = _newDAOAddress;
        emit DAOAddressSet(_newDAOAddress);
    }

    /// @notice Donate ETH into the treasury
    receive() external payable {
        donate_i(msg.sender, msg.value);
    }

    /// @notice Allows anyone to donate ETH via a function call
    function donate() external payable {
        donate_i(msg.sender, msg.value);
    }

    /// @notice Internal donate function
    function donate_i(address from, uint amount) internal {
        CTToken cTToken = CTToken(cTokenAddress);        
        uint amountToMint = msg.value / exchangeRate;
        cTToken.mint(from, amountToMint);
        emit Donated(from, amount);
    }

    /// @notice Fund a project from the treasury (only owner)
    /// @param _amount Amount in wei to withdraw
    /// @param _to Address to receive the withdrawn ETH
    function fund (uint256 _amount, address payable _to) external {
        require((msg.sender == cDAOAddress), "only the DAO can call the fund");
        require(address(this).balance >= _amount, "Insufficient balance");
        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Transfer failed");
    }


}