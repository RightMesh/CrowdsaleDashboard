import React from 'react';
import PurchasesTable from './PurchasesTable';
import TransactionsTable from './TransactionsTable';
import Form from './Form';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Content extends React.Component {
    constructor() {
      super();
      this.state = {
        colId: 1
      }
      this.setActiveCol = this.setActiveCol.bind(this);
    }
    setActiveCol(id){
      this.setState({colId: id});
    }
    render() {

        let table;

        if (this.state.colId == 1) {
            table = (<TransactionsTable transactions = {this.props.transactions} />)
        } else if (this.state.colId == 2) {
            table = (<PurchasesTable successTransfers = {this.props.successTransfers} />)
        }

        return (
          <section id='content'>
            <section class='header'>
              <div class='container' >
                <div class="row">
                  <div class="col-lg-8 col-md-8 col-sm-12">
                    <img class="logo" src="../img/rightmesh-logo.png" alt="RightMesh" />
                    <h1>Crowdsale Dashboard</h1>
                  </div>
                  <div class="col-lg-4 col-md-4 col-sm-12 align-self-end wallet-stats">
                    <p>Wallet Address: 0x671d8610bb9abb89b0313e2ee234d1c756e1092a</p>
                    <p>Owner Address: 0x671d8610bb9abb89b0313e2ee234d1c756e1092a</p>
                    <p>Token Address: 0x98873928fd0c20e692e0e35dcefdfbec5e945755</p>
                  </div>
                </div>
              </div>
            </section>

                <Form
                    weiRaised = {this.props.weiRaised}
                    rate = {this.props.rate}
                    cap = {this.props.cap}
                    contributors = {this.props.contributors}
                    progressPercent = {this.props.progressPercent}
                    progressBar = {this.props.progressBar}
                    minContribution = {this.props.minContribution}
                    mintingFinished = {this.props.mintingFinished}
                    hasEnded = {this.props.hasEnded}
                    walletAddr = {this.props.walletAddr}
                    ownerAddr = {this.props.ownerAddr}
                    tokenAddr = {this.props.tokenAddr}
                    startTime = {this.props.startTime}
                    endTime = {this.props.endTime} />
                <Router>
                  <div class='container'>
                    <div class="row">
                      <Link className={this.state.colId === 1? "col-lg-6 text-center link active" : "col-lg-6 text-center link"} onClick={() => this.setActiveCol(1)} to="/">All Contributions</Link>
                      <Link className={this.state.colId === 2? "col-lg-6 text-center link active" : "col-lg-6 text-center link"} onClick={() => this.setActiveCol(2)} to="/contributions">Successful Contributions</Link>
                    </div>
                  </div>
                </Router>
                {table}

            </section>
        )
    }
}

export default Content
