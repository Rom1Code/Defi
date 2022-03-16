const Token = artifacts.require('Token')
const BroToken = artifacts.require('BroToken')
const EthSwap = artifacts.require('EthSwap')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('EthSwap', ([deployer, investor]) => {
  let token, broToken, ethSwap

  before(async () => {
    token = await Token.new()
    broToken = await BroToken.new()
    ethSwap = await EthSwap.new(token.address, broToken.address)
    // Transfer all tokens to EthSwap (1 million)
    await token.transfer(ethSwap.address, tokens('1000000'))
    await broToken.transfer(ethSwap.address, tokens('1000000'))
  })

  describe('Token deployment', async () => {
    it('contract has a name', async () => {
      const name = await token.name()
      assert.equal(name, 'DApp Token')
    })
  })

  describe('BroToken deployment', async () => {
    it('contract has a name', async () => {
      const name = await broToken.name()
      assert.equal(name, 'Bro Token')
    })
  })

  describe('EthSwap deployment', async () => {
    it('contract has a name', async () => {
      const name = await ethSwap.name()
      assert.equal(name, 'EthSwap Instant Exchange')
    })

    it('contract has tokens', async () => {
      let balanceToken = await token.balanceOf(ethSwap.address)
      assert.equal(balanceToken.toString(), tokens('1000000'))
      let balanceBroToken = await broToken.balanceOf(ethSwap.address)
      assert.equal(balanceBroToken.toString(), tokens('1000000'))
    })
  })

  describe('buyTokens()', async () => {
    let result
    let result2


    before(async () => {
      // Purchase tokens before each example
      result = await ethSwap.buyTokens("token",{ from: investor, value: web3.utils.toWei('1', 'ether')})
      result2 = await ethSwap.buyTokens("broToken",{ from: investor, value: web3.utils.toWei('1', 'ether')})

    })

    it('Allows user to instantly purchase tokens from ethSwap for a fixed price', async () => {
      // Check investor token balance after purchase
      let investorTokenBalance = await token.balanceOf(investor)
      assert.equal(investorTokenBalance.toString(), tokens('100'))

      // Check ethSwap balance after purchase
      let ethSwapBalance
      ethSwapBalance = await token.balanceOf(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), tokens('999900'))

      ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei('2', 'Ether'))

      // Check logs to ensure event was emitted with correct data
      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')
    })

    it('Allows user to instantly purchase broTokens from ethSwap for a fixed price', async () => {
      // Check investor broToken balance after purchase
      let investorBroTokenBalance = await broToken.balanceOf(investor)
      assert.equal(investorBroTokenBalance.toString(), tokens('10000'))

      let ethSwapBalance2
      ethSwapBalance2 = await broToken.balanceOf(ethSwap.address)
      assert.equal(ethSwapBalance2.toString(), tokens('990000'))

      ethSwapBalance2 = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethSwapBalance2.toString(), web3.utils.toWei('2', 'Ether'))

      const event = result2.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, broToken.address)
      assert.equal(event.amount.toString(), tokens('10000').toString())
      assert.equal(event.rate.toString(), '10000')
    })
  })

  describe('sellTokens()', async () => {
    let result
    let result2

    before(async () => {
      // Investor must approve tokens before the purchase
      await token.approve(ethSwap.address, tokens('100'), { from: investor })
      // Investor sells tokens
      result = await ethSwap.sellTokens(tokens('100'), "token", { from: investor })

      // Investor must approve tokens before the purchase
      await broToken.approve(ethSwap.address, tokens('10000'), { from: investor })
      // Investor sells tokens
      result2 = await ethSwap.sellTokens(tokens('10000'), "broToken",{ from: investor })

    })

    it('Allows user to instantly sell tokens to ethSwap for a fixed price', async () => {
      // Check investor token balance after purchase
      let investorTokenBalance = await token.balanceOf(investor)
      assert.equal(investorTokenBalance.toString(), tokens('0'))

      // Check ethSwap balance after purchase
      let ethSwapBalance
      ethSwapBalance = await token.balanceOf(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), tokens('1000000'))
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'Ether'))

      // Check logs to ensure event was emitted with correct data
      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens('100').toString())
      assert.equal(event.rate.toString(), '100')

      // FAILURE: investor can't sell more tokens than they have
      await ethSwap.sellTokens(tokens('500'), "token",{ from: investor }).should.be.rejected;
    })

    it('Allows user to instantly sell broTokens to ethSwap for a fixed price', async () => {
      // Check investor token balance after purchase
      let investorBroTokenBalance = await broToken.balanceOf(investor)
      assert.equal(investorBroTokenBalance.toString(), tokens('0'))

      let ethSwapBalance2
      ethSwapBalance2 = await broToken.balanceOf(ethSwap.address)
      assert.equal(ethSwapBalance2.toString(), tokens('1000000'))
      ethSwapBalance2 = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethSwapBalance2.toString(), web3.utils.toWei('0', 'Ether'))


      // Check logs to ensure event was emitted with correct data
      const event = result2.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, broToken.address)
      assert.equal(event.amount.toString(), tokens('10000').toString())
      assert.equal(event.rate.toString(), '10000')


      // FAILURE: investor can't sell more tokens than they have
      await ethSwap.sellTokens(tokens('500'), "broToken",{ from: investor }).should.be.rejected;
    })

  })

})
