import React, { Component } from 'react'
import tokenLogo from '../token-logo.png'
import broTokenLogo from '../brocoin-logo.jpg'

class Pool extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      input2: '',
    }
  }
  componentWillMount() {
    this.props.getWaitingReward('DAPP')
    this.props.getWaitingReward('BRO')
  }

  render() {
    return (
      <div id="content" >
        <div className="bg-danger rounded mb-2 text-white shadow">
            <center>Dex Balance :</center>
            <center>{window.web3.utils.fromWei(this.props.dexTokenBalance, 'Ether')} DEX</center>
        </div>
        <div className="font-weight-bold text-white my-5 h4">
          POOL
        </div>

        <div className="card mb-3 shadow" >
          <div className="card-body">
            <form onSubmit={(event) => {
                event.preventDefault()
                let amount
                amount = this.input.value.toString()
                amount = window.web3.utils.toWei(amount, 'Ether')
                console.log("stake", amount)
                this.props.stakeTokens('DAPP', amount, Math.round(new Date()/1000))
              }}>
              <div>
                <label className="float-left">
                  <p>Stake <b>1 DAPP</b> token and get <b>1 DEX</b> token</p>
                </label>
                <br/>
                <span className="float-right text-muted">
                  Balance: {window.web3.utils.fromWei(this.props.tokenBalance, 'Ether')}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  //value={this.state.input}
                  onChange={(event) => {
                    this.setState({
                      input: this.input.value.toString()
                    })
                  }}
                  ref={(input) => { this.input = input }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={tokenLogo} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; DAPP
                  </div>
                  <button type="submit" className="btn-danger ml-1 rounded">STAKE!</button>
                  <button
                    type="submit"
                    className="btn-danger ml-1 rounded"
                    onClick={(event) => {
                        console.log( this.state.input)
                      event.preventDefault()
                      let tokenAmount
                      tokenAmount = this.state.input
                      tokenAmount = window.web3.utils.toWei(tokenAmount, 'Ether')
                      this.props.getReward('DAPP',  Math.round(new Date()/1000))
                      this.props.unstakeTokens('DAPP', tokenAmount)
                    }}>
                      UN-STAKE
                    </button>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <span>Total staked : {window.web3.utils.fromWei(this.props.tokenStakingBalance, 'Ether')} DAPP</span>
                <button
                      type="submit"
                      className="btn-danger ml-1 rounded"
                      onClick={(event) => {
                        event.preventDefault()
                        this.props.getReward('DAPP',  Math.round(new Date()/1000))
                      }}>
                        Claim Reward : {this.props.tokenWaitingReward}
                      </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card mb-3 shadow" >
          <div className="card-body">
            <form  onSubmit={(event) => {
                event.preventDefault()
                let amount2
                amount2 = this.input2.value.toString()
                amount2 = window.web3.utils.toWei(amount2, 'Ether')
                this.props.stakeTokens('BRO', amount2, Math.round(new Date()/1000))
              }}>
              <div>
                <label className="float-left"><p>Stake <b>100 BRO</b> token and get <b>1 DEX</b> token</p></label>
                <br/>
                <span className="float-right text-muted">
                  Balance: {window.web3.utils.fromWei(this.props.broTokenBalance, 'Ether')}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  onChange={(event) => {
                    this.setState({
                      input2: this.input2.value.toString()
                    })
                  }}
                  ref={(input2) => { this.input2 = input2 }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={broTokenLogo} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; BRO
                  </div>
                  <button type="submit" className=" btn-danger ml-1 rounded">STAKE!</button>
                  <button
                    type="submit"
                    className="btn-danger ml-1 rounded"
                    onClick={(event) => {
                      event.preventDefault()

                      let broTokenAmount
                      broTokenAmount = this.state.input2
                      console.log( window.web3.utils.toWei(broTokenAmount, 'Ether'))

                      broTokenAmount = window.web3.utils.toWei(broTokenAmount, 'Ether')
                      this.props.getReward('BRO', Math.round(new Date()/1000))
                      this.props.unstakeTokens('BRO', broTokenAmount)
                    }}>
                      UN-STAKE
                    </button>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <span>Total staked : {window.web3.utils.fromWei(this.props.broTokenStakingBalance, 'Ether')} BRO</span>
                <button
                      type="submit"
                      className="btn-danger ml-1 rounded"
                      onClick={(event) => {
                        event.preventDefault()
                        this.props.getReward('BRO', Math.round(new Date()/1000))
                      }}>
                        Claim Reward : {this.props.broTokenWaitingReward}
                      </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default Pool;
