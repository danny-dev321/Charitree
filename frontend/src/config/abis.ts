/**
 * Contract ABIs - Only including the functions we need
 * Full ABIs are in /contract/build/contracts/
 */

export const CTDAO_ABI = [
  'function members(address) view returns (bool)',
  'function memberNr() view returns (uint256)',
  'function proposalCount() view returns (uint256)',
  'function proposals(uint256) view returns (string description, uint256 budget, address beneficiary, address approver, uint256 votes, bool executed)',
  'function createProposal(string memory, uint256, address, address) returns (uint256)',
  'function vote(uint256) returns (bool)',
  'function executeProposal(uint256) returns (address)',
  'function cTTreasuryAddress() view returns (address)',
  'event ProposalCreated(uint256 proposalId, string description)',
  'event ProposalExecuted(uint256 proposalId)',
  'event Voted(uint256 proposalId, address voter)',
];

export const CTTreasury_ABI = [
  'function donate() payable',
  'function getBalance() view returns (uint256)',
  'function cTokenAddress() view returns (address)',
  'function cDAOAddress() view returns (address)',
  'function exchangeRate() view returns (uint256)',
  'event Donated(address donor, uint256 amount)',
];

export const CTToken_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function owner() view returns (address)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
];

