const Token = artifacts.require("Token");
const BroToken = artifacts.require("BroToken");
const DexToken = artifacts.require("DexToken");
const EthSwap = artifacts.require("EthSwap");
const PoolLiquidity = artifacts.require("PoolLiquidity");
const Gouvernance = artifacts.require("Gouvernance");


module.exports = async function(deployer) {
  // Deploy Token
  await deployer.deploy(Token,);
  const token = await Token.deployed()

  // Deploy BroToken
  await deployer.deploy(BroToken);
  const broToken = await BroToken.deployed()

  // Deploy DexToken
  await deployer.deploy(DexToken);
  const dexToken = await DexToken.deployed()


  // Deploy EthSwap
  await deployer.deploy(EthSwap, token.address, broToken.address);
  const ethSwap = await EthSwap.deployed()

  // Deploy PoolLiquidity
  await deployer.deploy(PoolLiquidity, dexToken.address, token.address, broToken.address, 60);
  const poolLiquidity = await PoolLiquidity.deployed()

  // Deploy Gouvernance
  await deployer.deploy(Gouvernance, dexToken.address);
  const gouvernance = await Gouvernance.deployed()



  // Transfer all tokens to EthSwap (1 million)
  await token.transfer(ethSwap.address, '1000000000000000000000000')
  await broToken.transfer(ethSwap.address, '1000000000000000000000000')

  // Transfer all tokens to PoolLiquidity (1 million)
  await dexToken.transfer(poolLiquidity.address, '1000000000000000000000000')
};
