pragma solidity ^0.5.0;

import "./Token.sol";
import "./BroToken.sol";

contract EthSwap {
  string public name = "EthSwap Instant Exchange";
  Token public token;
  BroToken public broToken;
  uint public tokenRate = 100;
  uint public broTokenRate = 10000;

  struct Transaction {
    uint id;
    string tokenBuyName;
    uint tokenBuyAmount;
    string tokenSoldName;
    uint tokenSoldAmount;
    uint timestamps;
  }

  mapping (uint => Transaction) public transactions;
  mapping (uint => address) public transactionToAccount;
  mapping (address => uint ) public accountTransactionCount;

  uint public transactionCount = 0;

  event TokensPurchased(
    address account,
    address token,
    uint amount,
    uint rate
  );

  event TokensSold(
    address account,
    address token,
    uint amount,
    uint rate
  );


  constructor(Token _token, BroToken _broToken) public {
      token = _token;
      broToken = _broToken;
  }


  function buyTokens(string memory nameToken) public payable {
    uint ethLog =0;
    uint tokenAmountLog=0;
    uint tokenAmount=0;

    if(keccak256(abi.encodePacked(nameToken))==keccak256(abi.encodePacked("DAPP"))){
      // Calculate the number of tokens to buy
      tokenAmount = msg.value * tokenRate ;
      ethLog = msg.value / 1000000000000000000 ;
      tokenAmountLog = ((msg.value * tokenRate) / 1000000000000000000);
      // Require that EthSwap has enough tokens   - this = adress du contrat
      require(token.balanceOf(address(this)) >= tokenAmount);
      // Transfer tokens to the user
      token.transfer(msg.sender, tokenAmount);
      // Emit an event
      emit TokensPurchased(msg.sender, address(token), tokenAmount, tokenRate);
    }
    else {
      tokenAmount = msg.value * broTokenRate ;
      ethLog = msg.value / 1000000000000000000;
      tokenAmountLog = ((msg.value * broTokenRate) / 1000000000000000000);
      // Require that EthSwap has enough tokens   - this = adress du contrat
      require(broToken.balanceOf(address(this)) >= tokenAmount);
      // Transfer tokens to the user
      broToken.transfer(msg.sender, tokenAmount);
      // Emit an event
      emit TokensPurchased(msg.sender, address(broToken), tokenAmount, broTokenRate);
    }

    //Log transaction
    transactionCount++;
    transactions[transactionCount] = Transaction(transactionCount, nameToken, tokenAmountLog, 'ETH', ethLog, block.timestamp);
    transactionToAccount[transactionCount] = msg.sender;
    //accountTransactionCount[msg.sender]++;
  }

  function sellTokens(uint _amount, string memory nameToken) public {
    uint etherAmountLog=0;
    uint tokenAmountLog=0;
    uint etherAmount=0;

    if(keccak256(abi.encodePacked(nameToken))==keccak256(abi.encodePacked("DAPP"))){
      // User can't sell more tokens than they have
      require(token.balanceOf(msg.sender) >= _amount);

      etherAmount = _amount / tokenRate;
      etherAmountLog = etherAmount / 1000000000000000000;
      tokenAmountLog =  _amount / 1000000000000000000;

      // Require that EthSwap has enough Ether
      require(address(this).balance >= etherAmount);

      // Perform sale
      token.transferFrom(msg.sender, address(this), _amount);
      msg.sender.transfer(etherAmount); //transfert la quantité à celui qui appele la fonction
      // Emit an event
      emit TokensSold(msg.sender, address(token), _amount, tokenRate);
    }
    else {
      // User can't sell more tokens than they have
      //require(broToken.balanceOf(msg.sender) >= _amount);

      // Calculate the amount of Ether to redeem
      etherAmount = _amount / broTokenRate;
      etherAmountLog = etherAmount / 1000000000000000000;
      tokenAmountLog =  _amount / 1000000000000000000;

      // Require that EthSwap has enough Ether
      //require(address(this).balance >= etherAmount);

      // Perform sale
      broToken.transferFrom(msg.sender, address(this), _amount);
      msg.sender.transfer(etherAmount); //transfert la quantité à celui qui appele la fonction
      // Emit an event
      emit TokensSold(msg.sender, address(broToken), _amount, broTokenRate);

    }
    //Log transaction
    transactionCount++;
    transactions[transactionCount] = Transaction(transactionCount, 'ETH', etherAmountLog, nameToken, tokenAmountLog, block.timestamp);
    transactionToAccount[transactionCount] = msg.sender;
    //accountTransactionCount[msg.sender]++;

  }

}
