import React, { Component } from 'react'
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'

class BuyForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      output: '0'
    }
  }

  render() {
    return (
      <form className="mb-3" onSubmit={(event) => {
          event.preventDefault()
          let etherAmount
          etherAmount = this.input.value.toString()
          etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')
          this.props.buyTokens(etherAmount)
        }}>
        <div>
          <label style={{color: "white"}} className="float-left"><b>From</b></label>
          <span className="float-right text-muted">
            <label style={{color: "white"}}>Balance : </label> <label style={{color: "blue"}}>{window.web3.utils.fromWei(this.props.ethBalance, 'Ether')}</label>
          </span>
        </div>
        <div className="input-group mb-4">
          <input
            type="text"
            onChange={(event) => {
              const etherAmount = this.input.value.toString()
              this.setState({
                output: etherAmount * 100
              })
            }}
            ref={(input) => { this.input = input }}
            className="form-control form-control-lg"
            placeholder="0"
            required />
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={ethLogo} height='32' alt=""/>
              &nbsp;&nbsp;&nbsp; ETH
            </div>
          </div>
        </div>
        <div>
          <label style={{color: "white"}} className="float-left"><b>To</b></label>
          <span className="float-right text-muted">
            <label style={{color: "white"}}> Balance : </label> <label style={{color: "blue"}}>{window.web3.utils.fromWei(this.props.tokenBalance, 'Ether')}</label>
          </span>
        </div>
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="0"
            value={this.state.output}
            disabled
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={tokenLogo} height='32' alt=""/>
              &nbsp; DApp
            </div>
          </div>
        </div>
        <div className="mb-5">
          <span className="float-left text-muted"><label style={{color: "white"}}>Exchange Rate</label></span>
          <span className="float-right text-muted"><label style={{color: "white"}}>1 ETH = 100 DApp</label></span>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
      </form>
    );
  }
}

export default BuyForm;
