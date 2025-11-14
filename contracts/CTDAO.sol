// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CTProject.sol";
import "./CTTreasury.sol";

/// @title ChariTree DAO
/// @author ...
/// @notice DAO contract for ChariTree
contract CTDAO {

    // types
    // proposal to vote
    struct Proposal {
        string description;
        uint budget;
        address payable beneficiary;
        address approver;
        uint256 votes;
        bool executed;
    }

    // properties
    mapping(uint256 => Proposal) public proposals;
    mapping(address => bool) public members;
    uint16 memberNr; 
    uint256 public proposalCount;
    address payable public cTTreasuryAddress;

    // events
    event ProposalCreated(uint256 proposalId, string description);
    event Voted(uint256 proposalId, address voter);
    event ProposalExecuted(uint256 proposalId);

    // modifiers
    modifier onlyMember() {
        require(members[msg.sender], "Not a DAO member");
        _;
    }

    // constructor
    constructor(
        address payable _cTTreasuryAddress,
        address[] memory initialMembers
        ) {
        cTTreasuryAddress = _cTTreasuryAddress;
        for (uint256 i = 0; i < initialMembers.length; i++) {
            members[initialMembers[i]] = true;
            memberNr++;
        }
    }

    /// @notice create a new proposal
    function createProposal(string memory _description, uint budget, address payable beneficiary, address approver) external onlyMember {
        proposals[proposalCount] = Proposal(_description,budget,beneficiary,approver, 0, false);
        emit ProposalCreated(proposalCount, _description);
        proposalCount++;
    }


    /// @notice vote for a proposal
    function vote(uint256 _proposalId) external onlyMember {
        require(!proposals[_proposalId].executed, "Already executed");
        proposals[_proposalId].votes++;
        emit Voted(_proposalId, msg.sender);
    }

    /// @notice executing a proposal
    function executeProposal(uint256 _proposalId) external onlyMember {
        require(proposals[_proposalId].votes >= (memberNr / 2) + 1, "Not enough votes");
        require(!proposals[_proposalId].executed, "Already executed");

        // logic for executing a proposal
        CTTreasury treasury = CTTreasury(cTTreasuryAddress);
        require ((proposals[_proposalId].budget <= treasury.getBalance()), "not enough budget for project");
        CTProject project = new CTProject(
            proposals[_proposalId].description,
            proposals[_proposalId].beneficiary,
            proposals[_proposalId].approver
            );
        // funding the project
        if (proposals[_proposalId].budget > 0) {
            treasury.fund(proposals[_proposalId].budget, payable(project));
        }

        proposals[_proposalId].executed = true;
        emit ProposalExecuted(_proposalId);
    }

}