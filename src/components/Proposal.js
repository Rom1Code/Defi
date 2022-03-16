import React, { Component } from 'react'


class Proposal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: "proposalList",
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

  progressBar(yes,total){
    const pourcentage = (yes / total) * 100
    if(pourcentage <= 25) {
    return <div className="progress-bar w-0" role="progressbar"  ></div>
    }
    else if(pourcentage <= 50) {
    return <div className="progress-bar w-25" role="progressbar"  ></div>
    }
    else if(pourcentage <= 75) {
    return <div className="progress-bar w-50" role="progressbar"  ></div>
    }
    else if(pourcentage > 75 && pourcentage < 100){
      return <div className="progress-bar w-75" role="progressbar"  ></div>
    }
    else if(pourcentage === 100) {
      return <div className="progress-bar w-100" role="progressbar"  ></div>
    }
    else {
      return <div className="progress-bar w-0" role="progressbar"  ></div>
    }
  }

  render() {
    let createForm
    if(window.web3.utils.fromWei(this.props.dexTokenBalance, 'Ether') >= 10000 && this.state.currentPage ==="proposalList"){
      createForm = <div className="rounded p-1">
      <p className="font-weight-bold h5 text-white">Create Proposal</p>
      <form onSubmit={(event) => {
        event.preventDefault()
        this.props.createProposal( this.input.value.toString(), this.input2.value)
        }}>
        <div className="bg-white rounded p-1">
        <p className=""><span className="font-weight-bold">Proposal description : </span>
          <input
              type="text"
              value={this.state.input}
              ref={(input) => { this.input = input }}
              className= "ml-2"
              placeholder="Description"
              required />
        </p>
          <p className=""><span className="font-weight-bold">End date :</span>
            <input
                type="text"
                value={this.state.input}
                ref={(input2) => { this.input2 = input2 }}
                className= "ml-2"
                placeholder="Timestamp"
                required />
          </p>
          <p>
          <button type="submit" className="btn btn-block btn-lg bg-danger text-white">Create</button>
          </p>
               </div>
        </form>

      </div>}
      else {
        createForm = <div className="bg-warning rounded p-1 text-center">!!! Get 10000 DEX to create a proposal !!!</div>
      }

    return (


    <div>
    <div className="bg-danger rounded mb-2 text-white">
        <center>Dex Balance :</center>
        <center>{window.web3.utils.fromWei(this.props.dexTokenBalance, 'Ether')} DEX</center>
    </div>
    <div className="font-weight-bold text-white my-5 h4">
      GOUVERNANCE
    </div>
    {createForm}
    {this.props.listeProposals.map((proposal, key)=> {
      let cpt = proposal.id.toString() - 1
      let status
      let endDate
      if(proposal.finishAt.toString() >  Math.round(new Date()/1000))
      {
        status = "In Progress"
        endDate = this.timeConverter(proposal.finishAt.toString())
      }
      else if(proposal.yes.toString()> proposal.no.toString())
      {
        status = <p className="text-success">Passed</p>
        endDate = "Finished"
      }
      else{
        status = "Rejected"
        endDate = "Finished"
      }

      if(this.props.hasVotedForProposal[cpt] === false && status ==="In Progress"){

      return(
        <div key={key} className="card my-3 p-1">
          <span  className="float-left font-weight-bold h4"> Proposal # {proposal.id.toString()}</span>
          <span className="text-danger"> {status}</span>
          <span className="my-2 font-weight-bold h5"> {proposal.description.toString()}</span>
          <div className="progress">
            {this.progressBar(proposal.yes.toString(),proposal.total.toString())}
          </div>
          <span> End time : <label className="text-dark">{endDate}</label></span>
          <span>
            <input
                  onClick={(event) => {this.props.voteForProposal(proposal.id.toString(),0,window.web3.utils.fromWei(this.props.dexTokenBalance, 'Ether'))}
                    }
                  className="btn btn-danger shadow-lg float-right ml-2" type="button" id="half" value="No" />
            <input
                  onClick={(event) => {this.props.voteForProposal(proposal.id.toString(),window.web3.utils.fromWei(this.props.dexTokenBalance, 'Ether'),0)}
                    }
                  className="btn btn-danger shadow-lg float-right" type="button" id="half" value="Yes" />
          </span>
        </div>
      )}
      else {
        return(
          <div key={key} className="card my-3 p-1">
            <span  className="float-left font-weight-bold h4"> Proposal # {proposal.id.toString()}</span>
            <span className="text-danger"> {status}</span>
            <span className="my-2 font-weight-bold h5"> {proposal.description.toString()}</span>
            <div className="progress">
              {this.progressBar(proposal.yes.toString(),proposal.total.toString())}
            </div>
            <span> End time : <label className="text-dark">{endDate}</label></span>
            <span>
              <input
                    onClick={(event) => {this.props.voteForProposal(proposal.id.toString(),0,window.web3.utils.fromWei(this.props.dexTokenBalance, 'Ether'))}
                      }
                    className="btn btn-danger shadow-lg float-right ml-2" type="button" id="half" value="No" disabled />
              <input
                    onClick={(event) => {this.props.voteForProposal(proposal.id.toString(),window.web3.utils.fromWei(this.props.dexTokenBalance, 'Ether'),0)}
                      }
                    className="btn btn-danger shadow-lg float-right" type="button" id="half" value="Yes" disabled/>
            </span>
          </div>
        )}
      }
      )}
    </div>
);
}
}

export default Proposal;
