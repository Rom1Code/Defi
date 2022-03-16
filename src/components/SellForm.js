import React, { Component } from 'react'
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'
import broTokenLogo from '../brocoin-logo.jpg'

class SellForm extends Component {
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
    if(valeur_cherchee==="BRO"){
      console.log("brotoken",valeur_cherchee)
      console.log(window.web3.utils.fromWei(this.props.broTokenBalance, 'Ether'))
      this.setState({tokenBalance : window.web3.utils.fromWei(this.props.broTokenBalance, 'Ether'),
      tokenRate: this.props.broTokenRate
      })
    }
    else {
      console.log(valeur_cherchee)
      this.setState({tokenBalance : window.web3.utils.fromWei(this.props.tokenBalance, 'Ether'),
      tokenRate: this.props.tokenRate
      })
    }
  }

  render() {
    return (
      <form className="mb-3" onSubmit={(event) => {
          event.preventDefault()
          let tokenAmount
          tokenAmount = this.input.value.toString()
          tokenAmount = window.web3.utils.toWei(tokenAmount, 'Ether')
          console.log("sellform", tokenAmount, this.state.tokenName)
          this.props.sellTokens(tokenAmount,this.state.tokenName)
        }}>
        <div className="text-white">
          <label className="font-weight-bold">From</label>
          <span className="float-right">
            <label className="font-weight-bold">Balance : </label> <label className="m-1">  {this.state.tokenBalance}</label>
            <input
              onClick={(event) => {
                  console.log("max", window.web3.utils.fromWei(this.props.tokenBalance, 'Ether'))
                  this.setState({
                    input: this.state.tokenBalance,
                    output: this.state.tokenBalance / this.state.tokenRate
                  })
              }
            }
              className="btn btn-danger shadow-lg" type="button" id="max" value="max" color="white" style={{marginRight: 5}} />
            <input
              onClick={(event) => {
                 this.setState({
                   input: this.state.tokenBalance / 2,
                   output : (this.state.tokenBalance / 2) / this.state.tokenRate
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
              const ethAmount = this.input.value.toString()
              this.setState({
                output: ethAmount / this.state.tokenRate,
                input: this.input.value.toString()
              })
            }}
            ref={(input) => { this.input = input }}
            className="form-control form-control-lg"
            placeholder="0"
            required />
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
        <div className="text-white">
          <label className="float-left font-weight-bold">To</label>
          <span className="float-right">
            <label className="font-weight-bold"> Balance : </label> <label className="m-1"> {window.web3.utils.fromWei(this.props.ethBalance, 'Ether')}</label>
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
              <img src={ethLogo} height='32' alt=""/>
              &nbsp;&nbsp;&nbsp; ETH
            </div>
          </div>
        </div>
        <div className="mb-5">
          <span className="float-left text-muted"><label style={{color: "white"}}>Exchange Rate</label></span>
          <span className="float-right text-muted"><label style={{color: "white"}}>{this.state.tokenRate} {this.state.tokenName} = 1 ETH</label></span>
        </div>
        <div style={{backgroundColor: "white", color:"red"}}>
          <button style={{color: "red", font : "bold"}} type="submit" className="btn btn-block btn-lg">SWAP!</button>
        </div>
      </form>
    );
  }
}

export default SellForm;
