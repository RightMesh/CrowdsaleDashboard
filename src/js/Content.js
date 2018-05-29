import React from 'react';
import PurchasesTable from './PurchasesTable';
import TransactionsTable from './TransactionsTable';
import Form from './Form';
import Finish from './Finish';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Content extends React.Component {
    constructor() {
      super();
      this.state = {
        colId: 2
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
        } else if (this.state.colId == 2 && this.props.soldOut == false) {
            table = (<PurchasesTable successTransfers = {this.props.successTransfers} />)
        } else if (this.state.colId == 2 && this.props.soldOut == true) {
           table = (<Finish />)
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
                    <p>Crowdsale Address: {this.props.crowdsaleAddr}</p>
                    <p>Wallet Address: {this.props.walletAddr}</p>
                    <p>Owner Address: {this.props.ownerAddr}</p>
                    <p>Token Address: {this.props.tokenAddr}</p>
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
                    soldOut = {this.props.soldOut}
                    walletAddr = {this.props.walletAddr}
                    ownerAddr = {this.props.ownerAddr}
                    tokenAddr = {this.props.tokenAddr}
                    startTime = {this.props.startTime}
                    endTime = {this.props.endTime} />

                {
                    this.props.advanced
                        ?  <Router>
                                <div class='container'>
                                    <div class="row">
                                        <Link className={this.state.colId === 2 ? "col-lg-6 text-center link active" : "col-lg-6 text-center link"} onClick={() => this.setActiveCol(2)} to="/">Successful Contributions</Link>
                                        <Link className={this.state.colId === 1 ? "col-lg-6 text-center link active" : "col-lg-6 text-center link"} onClick={() => this.setActiveCol(1)} to="/">Incoming Transactions</Link>
                                    </div>
                                </div>
                            </Router>
                        : <Router>
                            <div class='container'>
                                <div class="row">
                                    <Link className={this.state.colId === 2 ? "col-lg-6 text-center link active" : "col-lg-6 text-center link"} onClick={() => this.setActiveCol(2)} to="/contributions">Successful Contributions</Link>
                                </div>
                            </div>
                          </Router>
                }

                {table}

            </section>
        )
    }
}

export default Content
