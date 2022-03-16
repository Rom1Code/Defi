pragma solidity ^0.5.0;

import "./DexToken.sol";
import "./BroToken.sol";
import "./Token.sol";


contract PoolLiquidity {
    string public name = "Dapp Token Farm";
    address public owner;
    DexToken public dexToken;
    Token public token;
    BroToken public broToken;

    uint public rewardTime;

    //token staking
    address[] public tokenStakers;
    mapping(address => uint) public tokenStakingBalance;
    mapping(address => bool) public hasStakedToken;
    mapping(address => bool) public isStakingToken;
    mapping(address => uint256) public tokenDepositTime;
    mapping(address => uint256) public tokenClaimTime;


    //broToken staking
    address[] public broTokenStakers;
    mapping(address => uint) public broTokenStakingBalance;
    mapping(address => bool) public hasStakedBroToken;
    mapping(address => bool) public isStakingBroToken;
    mapping(address => uint256) public broTokenDepositTime;
    mapping(address => uint256) public broTokenClaimTime;


    constructor(DexToken _dexToken, Token _token, BroToken _broToken, uint _rewardTime) public {
        broToken = _broToken;
        token = _token;
        dexToken = _dexToken;
        rewardTime = _rewardTime;
        owner = msg.sender;
    }

    function stakeTokens(string memory nameToken, uint _amount, uint _depositTime) public {
        if(keccak256(abi.encodePacked(nameToken))==keccak256(abi.encodePacked("DAPP")))
        {
          // Require amount greater than 0
          require(_amount > 0, "amount cannot be 0");

          // Trasnfer Mock Dai tokens to this contract for staking
          token.transferFrom(msg.sender, address(this), _amount);

          // Update staking balance
          tokenStakingBalance[msg.sender] = tokenStakingBalance[msg.sender] + _amount;
          tokenDepositTime[msg.sender] = _depositTime;

          // Add user to stakers array *only* if they haven't staked already
          if(!hasStakedToken[msg.sender]) {
              tokenStakers.push(msg.sender);
          }

          // Update staking status
          isStakingToken[msg.sender] = true;
          hasStakedToken[msg.sender] = true;
        }
        else{
          // Require amount greater than 0
          require(_amount > 0, "amount cannot be 0");

          // Trasnfer Mock Dai tokens to this contract for staking
          broToken.transferFrom(msg.sender, address(this), _amount);

          // Update staking balance
          broTokenStakingBalance[msg.sender] = broTokenStakingBalance[msg.sender] + _amount;
          broTokenDepositTime[msg.sender] = _depositTime;

          // Add user to stakers array *only* if they haven't staked already
          if(!hasStakedBroToken[msg.sender]) {
              broTokenStakers.push(msg.sender);
          }
          // Update staking status
          isStakingBroToken[msg.sender] = true;
          hasStakedBroToken[msg.sender] = true;
        }
    }

    // Unstaking Tokens (Withdraw)
    function unstakeTokens(string memory nameToken, uint _amount) public {
      if(keccak256(abi.encodePacked(nameToken))==keccak256(abi.encodePacked("DAPP")))
      {
        // Fetch staking balance
        uint balance = tokenStakingBalance[msg.sender];

        // Require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");

        // Transfer Mock Dai tokens to this contract for staking
        token.transfer(msg.sender, _amount);

        // Reset staking balance
        tokenStakingBalance[msg.sender] = tokenStakingBalance[msg.sender] - _amount;
        if(tokenStakingBalance[msg.sender] == 0){
          tokenDepositTime[msg.sender] = 0;
        }
        // Update staking status
        if(tokenStakingBalance[msg.sender] == 0) {
          isStakingToken[msg.sender] = false;
        }
      }
      else{
        // Fetch staking balance
        uint balance = broTokenStakingBalance[msg.sender];

        // Require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");

        // Transfer Mock Dai tokens to this contract for staking
        broToken.transfer(msg.sender, _amount);

        // Reset staking balance
        broTokenStakingBalance[msg.sender] = broTokenStakingBalance[msg.sender] - _amount;
        if(broTokenStakingBalance[msg.sender] == 0){
          broTokenDepositTime[msg.sender] = 0;
        }
        // Update staking status
        if(broTokenStakingBalance[msg.sender] == 0) {
          isStakingBroToken[msg.sender] = false;
        }
      }
    }

    // Issuing Tokens
    function issueTokens(string memory nameToken, uint _claimTime) public {
        // Only owner can call this function
        require(msg.sender == owner, "caller must be the owner");

        if(keccak256(abi.encodePacked(nameToken))==keccak256(abi.encodePacked("DAPP")))
        {
        // Issue tokens
            uint balance = tokenStakingBalance[msg.sender];
            uint time = tokenDepositTime[msg.sender] + rewardTime;
            uint tokenWaitingReward = 0;
            if(balance > 0) {
              while(time < block.timestamp) {
                tokenWaitingReward +=balance;
                time +=rewardTime;
              }
                dexToken.transfer(msg.sender, tokenWaitingReward);
                tokenDepositTime[msg.sender] = _claimTime;
            }
        }
        else{
          uint balance = broTokenStakingBalance[msg.sender] / 100;
          uint time = broTokenDepositTime[msg.sender] + rewardTime;
          uint tokenWaitingReward = 0;
          if(balance > 0) {
            while(time < block.timestamp) {
              tokenWaitingReward +=balance;
              time +=rewardTime;
            }
              dexToken.transfer(msg.sender, tokenWaitingReward);
              broTokenDepositTime[msg.sender] = _claimTime;
          }
        }
    }
}
