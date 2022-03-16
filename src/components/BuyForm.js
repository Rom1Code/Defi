import React, { Component } from 'react'
import tokenLogo from '../token-logo.png'
import broTokenLogo from '../brocoin-logo.jpg'
import ethLogo from '../eth-logo.png'

class BuyForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      output: '',
      input: '',
      tokenName:'DAPP',
      tokenBalance: window.web3.utils.fromWei(this.props.tokenBalance, 'Ether'),
      tokenRate: this.props.tokenRate
    }
  }

  logo = () => {
    if(this.state.tokenName==="BRO"){
      return <img src={broTokenLogo} alt="" height='32' style={{marginRight:10}}/>
    }
    else{
      return <img src={tokenLogo} alt="" height='32' style={{marginRight:10}}/>
    }
  }

  getInputListValue = () => {
    var select = document.getElementById("input_list")
    var choice = select.selectedIndex // Récupération de l'index du <option> choisi
    var valeur_cherchee = select.options[choice].value // Récupération du texte du <option> d'index "choice"
    this.setState({tokenName : valeur_cherchee})
    console.log(valeur_cherchee)
    if(valeur_cherchee==="BRO"){
      this.setState({tokenBalance : window.web3.utils.fromWei(this.props.broTokenBalance, 'Ether'),
      tokenRate: this.props.broTokenRate
      })
    }
    else {
      this.setState({tokenBalance : window.web3.utils.fromWei(this.props.tokenBalance, 'Ether'),
      tokenRate: this.props.tokenRate
      })
    }
  }

  render() {
    return (
      <form className="mb-3 text-white" onSubmit={(event) => {
          event.preventDefault()
          let etherAmount
          etherAmount = this.input.value.toString()
          etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')
          this.props.buyTokens(this.state.tokenName,etherAmount)
        }}>
        <div className="text-white">
          <label className="float-left font-weight-bold">From</label>
          <span className="float-right">
            <label className="font-weight-bold">Balance : </label> <label className="m-1">{window.web3.utils.fromWei(this.props.ethBalance, 'Ether')} </label>
            <input
              onClick={(event) => {
                console.log("max")
                   this.output.value = this.input.value.toString() * this.state.tokenRate
                  this.setState({
                    input: window.web3.utils.fromWei(this.props.ethBalance, 'Ether'),
                    output: window.web3.utils.fromWei(this.props.ethBalance, 'Ether') * this.state.tokenRate
                  })
              }
            }
             className="btn btn-danger shadow-lg" type="button" id="max" value="max" style={{marginRight: 5}} />
            <input
              onClick={(event) => {
                 this.setState({
                   input: (window.web3.utils.fromWei(this.props.ethBalance, 'Ether') / 2),
                   output: (window.web3.utils.fromWei(this.props.ethBalance, 'Ether') / 2) * this.state.tokenRate
                              })
                 }
              }
            className="btn btn-danger shadow-lg" type="button" id="half" value="half" />
          </span>

        </div>
        <div className="input-group mb-4">
          <input
            type="text"
            value={this.state.input}
            onChange={(event) => {
              const etherAmount = this.input.value.toString()
              this.setState({
                output: etherAmount * this.state.tokenRate,
                input: this.input.value.toString()
              })
            }}
            ref={(input) => { this.input = input }}
            className="form-control form-control-lg"
            placeholder='0'
            required />
          <div className="input-group-append">
            <div className="input-group-text">
            <img src={ethLogo} height='32' alt=""/>
            &nbsp; ETH
            </div>
          </div>
        </div>
        <div className="text-white">
          <label className="float-left font-weight-bold">To</label>
          <span className="float-right">
            <label > <b>Balance :</b> </label> <label className="m-1" >{this.state.tokenBalance}</label>
          </span>
        </div>
        <div className="input-group mb-2">
          <input
            type="text"
            ref={(output) => { this.output = output }}
            className="form-control form-control-lg"
            placeholder="0"
            value={this.state.output}
            disabled
          />
          <div className="input-group-append">
            <div className="input-group-text">
              {this.logo()}
              <select name="inputList" id="input_list" onChange={(event) => {this.getInputListValue()}}>
                <option value="DAPP">DAPP</option>
                <option value="BRO">BRO</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mb-5 text-white">
          <span className="float-left"><label>Exchange Rate</label></span>
          <span className="float-right"><label>1 ETH = {this.state.tokenRate} {this.state.tokenName}</label></span>
        </div>
        <div className="bg-white rounded">
          <button type="submit" className="btn btn-block btn-lg text-danger font-weight-bold">SWAP!</button>
        </div>
      </form>
    );
  }
}

export default BuyForm;
