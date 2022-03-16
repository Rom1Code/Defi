import React, { Component } from 'react'
import Web3 from 'web3'
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import Background from '../background.jpg'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      token: {},
      ethSwap: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: true,
      listeTransactionsAccount : [],
      listeTransactionsTotal: [],
      transactionCount : ''
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



    // Load EthSwap
    const ethSwapData = EthSwap.networks[networkId]
    if(ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      this.setState({ ethSwap })
      console.log(ethSwap.address)
      const contractEthBalance = await web3.eth.getBalance(this.state.ethSwap.address)
      console.log("contract balance" ,contractEthBalance)
      const transactionCount = await ethSwap.methods.transactionCount().call()
      this.setState({ transactionCount })
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

  buyTokens = (etherAmount) => {
    //const web3 = window.web3
    //console.log(web3.utils.fromWei(etherAmount))
    //console.log(etherAmount)
    this.setState({ loading: true })
    this.state.ethSwap.methods.buyTokens().send({ value: etherAmount, from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
      console.log(this.state.transactionCount.toNumber())
    })
  }

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => delayedCallback(this, hash))
    function delayedCallback(obj, hash) {
          console.log('in delay', obj.state.account)
          window.setTimeout(() => { console.log('approval', hash)
            obj.state.ethSwap.methods.sellTokens(tokenAmount).send({ from: obj.state.account }).on('transactionHash', (hash) => {
              obj.setState({ loading: false })
            })
          }, 1000)
        }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
        listeTransactionsAccount={this.state.listeTransactionsAccount}
      />
    }

    return (
      <div style={{ backgroundImage: `url(${Background})`}}>
        <Navbar account={this.state.account} />
        <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
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
