import React, { Component } from 'react'
import Web3 from 'web3'
import BroToken from '../abis/BroToken.json'
import DexToken from '../abis/DexToken.json'
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import PoolLiquidity from '../abis/PoolLiquidity.json'
import Gouvernance from '../abis/Gouvernance.json'
import Identicon from 'identicon.js';
import DexLogo from '../Dexter_Logo.png'

//import Navbar from './Navbar'
import Swap from './Swap'
import Proposal from './Proposal'
import Pool from './Pool'

import './App.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentForm: 'swap',
      account: '',
      token: {},
      tokenRate:'0',
      broToken: {},
      broTokenRate:'0',
      dexToken: {},
      dexTokenBalance:'0',
      ethSwap: {},
      ethBalance: '0',
      tokenBalance: '0',
      broTokenBalance: '0',
      loading: true,
      listeTransactionsAccount : [],
      listeTransactionsTotal: [],
      transactionCount : '',

      poolLiquidity: {},
      tokenStakingBalance: '0',
      tokenDepositTime: '',
      rewardTime: 0,
      tokenNextReward: '',
      tokenWaitingReward:'0',
      broTokenWaitingReward:'0',
      broTokenStakingBalance: '0',
      broTokenDepositTime: '',
      broTokenNextReward: '',

      listeProposals: [],
      listeVotes: [],
      hasVotedForProposal: []
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance })

    // Load Token
    const networkId =  await web3.eth.net.getId()
    const tokenData = Token.networks[networkId]
    if(tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({ token })
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      this.setState({ tokenBalance: tokenBalance.toString() })
    } else {
      window.alert('Token contract not deployed to detected network.')
    }

    // Load BroToken
    const networkIdBroToken =  await web3.eth.net.getId()
    const broTokenData = BroToken.networks[networkIdBroToken]
    if(broTokenData) {
      const broToken = new web3.eth.Contract(Token.abi, broTokenData.address)
      this.setState({ broToken })
      let broTokenBalance = await broToken.methods.balanceOf(this.state.account).call()
      this.setState({ broTokenBalance: broTokenBalance.toString() })
    } else {
      window.alert('Token contract not deployed to detected network.')
    }

    // Load DexToken
    const networkIdDexToken =  await web3.eth.net.getId()
    const dexTokenData = DexToken.networks[networkIdDexToken]
    if(dexTokenData) {
      const dexToken = new web3.eth.Contract(DexToken.abi, dexTokenData.address)
      this.setState({ dexToken })
      let dexTokenBalance = await dexToken.methods.balanceOf(this.state.account).call()
      this.setState({ dexTokenBalance: dexTokenBalance.toString() })
    } else {
      window.alert('Token contract not deployed to detected network.')
    }

    // Load EthSwap
    const ethSwapData = EthSwap.networks[networkId]
    if(ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      this.setState({ ethSwap })

      console.log(ethSwap.address)
      const contractEthBalance = await web3.eth.getBalance(this.state.ethSwap.address)
      console.log("contract balance" ,contractEthBalance)

      const transactionCount = await ethSwap.methods.transactionCount().call()
      const broTokenRate = await ethSwap.methods.broTokenRate().call()
      const tokenRate = await ethSwap.methods.tokenRate().call()
      this.setState({
        transactionCount,
        broTokenRate: broTokenRate.toNumber(),
        tokenRate: tokenRate.toNumber()
       })
      for(var i=1; i <= this.state.transactionCount;i++){
        const transactionToAccount = await this.state.ethSwap.methods.transactionToAccount(i).call();
        const transaction = await this.state.ethSwap.methods.transactions(i).call();
        this.setState({
          listeTransactionsTotal: [...this.state.listeTransactionsTotal, transaction],
        })
        if(transactionToAccount===this.state.account){
           this.setState({
            listeTransactionsAccount: [...this.state.listeTransactionsAccount, transaction],
           })
         }
       }
    }
     else {
      window.alert('EthSwap contract not deployed to detected network.')
    }


    // Load PoolLiquidity
    const poolLiquidityData = PoolLiquidity.networks[networkId]
    if(poolLiquidityData) {
      const poolLiquidity = new web3.eth.Contract(PoolLiquidity.abi, poolLiquidityData.address)
      this.setState({ poolLiquidity })
      let tokenStakingBalance = await poolLiquidity.methods.tokenStakingBalance(this.state.account).call()
      let tokenDepositTime = await poolLiquidity.methods.tokenDepositTime(this.state.account).call()
      let broTokenStakingBalance = await poolLiquidity.methods.broTokenStakingBalance(this.state.account).call()
      let broTokenDepositTime = await poolLiquidity.methods.broTokenDepositTime(this.state.account).call()
      let rewardTime = await poolLiquidity.methods.rewardTime().call()
      this.setState({
        tokenStakingBalance: tokenStakingBalance.toString(),
        tokenDepositTime,
        broTokenStakingBalance: broTokenStakingBalance.toString(),
        broTokenDepositTime,
        rewardTime,
        tokenNextReward: (parseFloat(tokenDepositTime)) + parseFloat(rewardTime),
        broTokenNextReward: (parseFloat(broTokenDepositTime)) + parseFloat(rewardTime)
       })
    } else {
      window.alert('TokenFarm contract not deployed to detected network.')
    }

    //Load gouvernance
    const gouvernanceData = Gouvernance.networks[networkId]
    if(gouvernanceData) {
      const gouvernance = new web3.eth.Contract(Gouvernance.abi, gouvernanceData.address)
      this.setState({ gouvernance })
      let nbProposal = await this.state.gouvernance.methods.nbProposal.call()
      for(var i3 = 1; i3 <= nbProposal; i3++) {
        let proposal = await gouvernance.methods.proposals(i3).call()
        let hasVotedForProposal = await gouvernance.methods.hasVotedForProposal(i, this.state.account).call()
        this.setState({ listeProposals : [...this.state.listeProposals, proposal],
                        hasVotedForProposal: [...this.state.hasVotedForProposal, hasVotedForProposal]
          })
      }
      let nbVote = await this.state.gouvernance.methods.nbVote.call()
      for(var i2 = 1; i2 <= nbVote; i2++) {
        let vote = await gouvernance.methods.votes(i2).call()
        this.setState({ listeVotes : [...this.state.listeVotes, vote],
        })
      }
    } else {
      window.alert('TokenFarm contract not deployed to detected network.')
    }
    this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  buyTokens = (tokenName, etherAmount) => {
    console.log("buy token", tokenName , etherAmount)
    this.setState({ loading: true })
    this.state.ethSwap.methods.buyTokens(tokenName).send({ value: etherAmount, from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
      //console.log(this.state.transactionCount.toNumber())
    })
  }

  sellTokens = (tokenAmount, tokenName) => {
    console.log("sell token", tokenAmount , tokenName)
    if(tokenName ==="DAPP") {
      this.setState({ loading: true })
      this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => delayedCallback(this, hash))
      function delayedCallback(obj, hash) {
            console.log('in delay', obj.state.account)
            window.setTimeout(() => { console.log('approval', hash)
              obj.state.ethSwap.methods.sellTokens(tokenAmount, tokenName).send({ from: obj.state.account }).on('transactionHash', (hash) => {
                obj.setState({ loading: false })
              })
            }, 1000)
          }
    }
    else{
        this.setState({ loading: true })
        this.state.broToken.methods.approve(this.state.ethSwap.address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => delayedCallback(this, hash))
        function delayedCallback(obj, hash) {
              console.log('in delay', obj.state.account)
              window.setTimeout(() => { console.log('approval', hash)
                obj.state.ethSwap.methods.sellTokens(tokenAmount, tokenName).send({ from: obj.state.account }).on('transactionHash', (hash) => {
                  obj.setState({ loading: false })
                })
              }, 1000)
            }
    }
  }

  stakeTokens = (tokenName, amount, timestamp) => {
    console.log("stake token", tokenName, amount, timestamp)
    if(tokenName ==="DAPP") {
      this.setState({ loading: true })
      this.state.token.methods.approve(this.state.poolLiquidity.address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => delayedCallback(this, hash))
      function delayedCallback(obj, hash) {
            console.log('in delay', obj.state.account)
            window.setTimeout(() => { console.log('approval', hash)
            obj.state.poolLiquidity.methods.stakeTokens(tokenName, amount, timestamp).send({ from: obj.state.account }).on('transactionHash', (hash) => {
            obj.setState({ loading: false })
          })
        },1000)
      }
    }
    else{
      this.setState({ loading: true })
      this.state.broToken.methods.approve(this.state.poolLiquidity.address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => delayedCallback(this, hash))
      function delayedCallback(obj, hash) {
            console.log('in delay', obj.state.account)
            window.setTimeout(() => { console.log('approval', hash)
            obj.state.poolLiquidity.methods.stakeTokens(tokenName, amount, timestamp).send({ from: obj.state.account }).on('transactionHash', (hash) => {
            obj.setState({ loading: false })
          })
        },1000)
      }
    }
  }

  unstakeTokens = (tokenName, amount) => {
    console.log("unstake", tokenName, amount)
    this.setState({ loading: true })
    this.state.poolLiquidity.methods.unstakeTokens(tokenName, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

   getReward = (tokenName, timestamp) => {
     console.log("get reward", tokenName, timestamp)
      this.state.poolLiquidity.methods.issueTokens(tokenName, timestamp).send({ from: this.state.account })
  }

    getWaitingReward=(tokenName) => {
      let balance = 0
      let total = 0
      let time = 0
      if(tokenName==="DAPP"){
        balance = this.state.tokenStakingBalance
        time = parseFloat(this.state.tokenDepositTime) + parseFloat(this.state.rewardTime)
        if(balance > 0) {
          while(Math.round(time) < Math.round(new Date()/1000)) {
            total = parseFloat(total) + parseFloat(window.web3.utils.fromWei(balance.toString(),'Ether'))
            time = parseFloat(Math.round(time)) + parseFloat(this.state.rewardTime.toNumber());
          }
          this.setState({ tokenWaitingReward: total.toString()})
          return this.state.tokenWaitingReward
        }
        else {return 0}
      }
      else{
        balance = this.state.broTokenStakingBalance / 100
        time = parseFloat(this.state.broTokenDepositTime) + parseFloat(this.state.rewardTime)
        if(balance > 0) {
          while(Math.round(time) < Math.round(new Date()/1000)) {
            total = (parseFloat(total) + parseFloat(window.web3.utils.fromWei(balance.toString(),'Ether')))
            time = parseFloat(Math.round(time)) + parseFloat(this.state.rewardTime.toNumber());
          }
          this.setState({ broTokenWaitingReward: total.toString()})
          return this.state.broTokenWaitingReward
        }
        else {return 0}
      }
    }

  voteForProposal = (id, yes, no) => {
    console.log("vote", id, yes, no)
    this.setState({ loading: true })
    this.state.gouvernance.methods.voteForProposal(id,yes,no).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  createProposal =(description, finishAt) => {
    console.log("createProposal", description, finishAt)
    this.setState({ loading: true })
    this.state.gouvernance.methods.createProposal(description,finishAt).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }


  timestampToDate(timestamp){
    var date = new Date(timestamp * 1000)
    var result = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + ' ' + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes() + ':' + (date.getSeconds()<10?'0':'') + date.getSeconds()
    return result
  }


  render() {

    let content
    if(this.state.loading) {
      content = <p style={{color:'white'}}id="loader" className="text-center">Loading...</p>
    }
    else if(this.state.currentForm==='swap'){
      content = <Swap
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        tokenRate={this.state.tokenRate}
        broTokenRate={this.state.broTokenRate}
        broTokenBalance={this.state.broTokenBalance}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
        listeTransactionsAccount={this.state.listeTransactionsAccount}
      />
    }
    else if(this.state.currentForm==='pool') {
        content = <Pool
          dexTokenBalance={this.state.dexTokenBalance}
          tokenBalance={this.state.tokenBalance}
          broTokenBalance={this.state.broTokenBalance}
          tokenStakingBalance={this.state.tokenStakingBalance}
          broTokenStakingBalance={this.state.broTokenStakingBalance}
          stakeTokens={this.stakeTokens}
          unstakeTokens={this.unstakeTokens}
          getReward={this.getReward}
          getWaitingReward={this.getWaitingReward}
          tokenWaitingReward={this.state.tokenWaitingReward}
          broTokenWaitingReward={this.state.broTokenWaitingReward}
/>
    }
    else {
          content = <Proposal
            dexTokenBalance = {this.state.dexTokenBalance}
            listeProposals = {this.state.listeProposals}
            hasVotedForProposal = {this.state.hasVotedForProposal}
            voteForProposal = {this.voteForProposal}
            createProposal = {this.createProposal}
            listeVotes = {this.state.listeVotes}
            updateProposalState = {this.updateProposalState}
            />
    }
    return (
      <div className="bg-dark bg-gradient">

        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap shadow">
          <div className=" col text-center ml-5">
          <img src={DexLogo} style={{width:80, height:50}}  alt="" className="col-sm-3 col-md-2 mr-0 rounded-circle"/>

            <button className="btn btn-outline-danger m-2"
                    onClick={(event) => {
                            this.setState({ currentForm: 'swap' })
                          }}>
                        Trade
            </button>
            <button className="btn btn-outline-danger m-2"
                    onClick={(event) => {
                            this.setState({ currentForm: 'pool' })
                          }}
                        >
                        Pool
            </button>
            <button className="btn btn-outline-danger m-2"
                    onClick={(event) => {
                            this.setState({ currentForm: 'gouvernance' })
                          }}>
                        Gouvernance
            </button>

          </div>

          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-secondary">
                <small id="account">{this.state.account}</small>
              </small>

              { this.state.account
                ? <img
                  className="ml-2"
                  width='30'
                  height='30'
                  src={`data:image/png;base64,${new Identicon(this.state.account, 30).toString()}`}
                  alt=""
                />
                : <span></span>
              }

            </li>
          </ul>
        </nav>
        <div className="container mt-5" >
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto mt-5" style={{ maxWidth: '600px'}}>
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}
export default App;
