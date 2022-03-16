import React, { Component } from 'react'
import BuyForm from './BuyForm'
import SellForm from './SellForm'
import inversion2 from '../inversion2.png'


class Swap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentForm: 'buy'
    }
  }

  timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

  render() {
    let content
    if(this.state.currentForm === 'buy') {
      content = <BuyForm
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        tokenRate={this.props.tokenRate}
        broTokenBalance={this.props.broTokenBalance}
        broTokenRate={this.props.broTokenRate}
        buyTokens={this.props.buyTokens}
      />
    } else {
      content = <SellForm
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        tokenRate={this.props.tokenRate}
        broTokenBalance={this.props.broTokenBalance}
        broTokenRate={this.props.broTokenRate}
        sellTokens={this.props.sellTokens}
      />
    }
    return (
      <div id="content" className="rounded">
        <div className="bg-danger card mb-4 shadow-lg" >
          <div className="card-body ">
            {content}
          </div>
          <center>
          <input
            onClick={(event) => {
              if(this.state.currentForm==='buy'){
            this.setState({ currentForm: 'sell' }) }
            else {
              this.setState({ currentForm: 'buy' })
            }
          }}
           type="image" id="image" alt="switch" width='50'
                 src={inversion2} />
          </center>
        </div>
        <br/>
        <div className="bg-danger text-white rounded mb-5 shadow-lg" >
        <h5><center>Historique transactions</center></h5>
        <center><table width='100%' border="1"  >
          <thead>
          <tr>
            <th><center>Id</center></th>
            <th><center>Bought</center></th>
            <th><center>Amount bought</center></th>
            <th><center>Sold</center></th>
            <th><center>Amount sold</center></th>
            <th><center>Timestamp</center></th>
          </tr>
          </thead>
          <tbody>
                    {this.props.listeTransactionsAccount.map((transaction, key)=> {
            return(
              <tr key={key}>
                <td width='5%'><center> {transaction.id.toString()}</center></td>
                <td width='15%'><center>{transaction.tokenBuyName.toString()}</center></td>
                <td width='15%'><center>{transaction.tokenBuyAmount.toNumber()}</center></td>
                <td width='15%'><center>{transaction.tokenSoldName.toString()}</center></td>
                <td width='15%'><center>{transaction.tokenSoldAmount.toNumber()}</center></td>
                <td width='25%'><center> {this.timeConverter(transaction.timestamps.toString())}</center></td>
              </tr>
          )}
        )}
          </tbody>
        </table></center>
      </div>
      </div>
    );
  }
}

export default Swap;
