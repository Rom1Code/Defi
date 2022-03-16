pragma solidity ^0.5.0;

import "./DexToken.sol";

contract Gouvernance {
  DexToken public dexToken;
  uint public nbProposal = 0;
  uint public nbVote = 0;


  constructor(DexToken _dexToken) public {
    dexToken = _dexToken;
  }

  struct Proposal {
    uint id;
    string description;
    uint createAt;
    uint finishAt;
    uint yes;
    uint no;
    uint total;
    string state;
    address createdBy;
  }

  struct Vote {
    uint prposalId;
    string result;
    uint timestamp;
    address voter;
  }

  mapping (uint => Proposal) public proposals;
  mapping (uint => address) public proposalToAccount;
  mapping (uint => mapping (address => bool)) public hasVotedForProposal;
  mapping (uint => Vote) public votes;

  event ProposalCreated(
    address account,
    string description,
    uint createAt,
    uint finishAt
  );

  event VoteSent(
    address account,
    uint timestamp,
    uint proposalId,
    string result
  );


  function createProposal (string memory _description, uint _finishAt) public {
    //Require 100000 dextoken to create a proposals
    require(dexToken.balanceOf(msg.sender) >= 10000, "You must have at least 10000 DEX");

    nbProposal++;
    proposals[nbProposal] = Proposal(nbProposal, _description, block.timestamp, _finishAt, 0, 0, 0, "In Progress", msg.sender);
    proposalToAccount[nbProposal] = msg.sender;

    emit ProposalCreated(msg.sender, _description, block.timestamp, _finishAt);
  }

  function voteForProposal(uint _proposalId, uint _yes, uint _no) public {
    //Require that the address didn't has vote for the proposal
    require(hasVotedForProposal[_proposalId][msg.sender] == false, "already vote for this proposal");
    //Require current timestamp is before finishAt
    require(proposals[_proposalId].finishAt > block.timestamp, "voting period finished");

    proposals[_proposalId].yes = proposals[_proposalId].yes + _yes;
    proposals[_proposalId].no = proposals[_proposalId].no + _no;
    proposals[_proposalId].total = proposals[_proposalId].no + proposals[_proposalId].yes;

    nbVote ++;

    if(_yes != 0) {
      votes[nbVote] = Vote(_proposalId, "yes", block.timestamp, msg.sender);
      emit VoteSent(msg.sender, block.timestamp, _proposalId, "yes");
    }
    else {
      votes[nbVote] = Vote(_proposalId, "no", block.timestamp, msg.sender);
      emit VoteSent(msg.sender, block.timestamp, _proposalId, "no");
    }

    hasVotedForProposal[_proposalId][msg.sender] = true;
    proposalToAccount[_proposalId] = msg.sender;
  }

  
}
