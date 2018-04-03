import React from 'react'
import Timestamp from 'react-timestamp';

class Form extends React.Component {
  render() {
    return (
        <div>
            <p>Wei Raised: {this.props.weiRaised}</p>
            <p>Rate: {this.props.rate}</p>
            <p>Cap: {this.props.cap}</p>
            <p>Min Contribution: {this.props.minContribution}</p>
            <p>Has Ended: {this.props.hasEnded.toString()}</p>
            <p>Minting Finished: {this.props.mintingFinished.toString()}</p>
            <p>Wallet Address: {this.props.walletAddr}</p>
            <p>Owner Address: {this.props.ownerAddr}</p>
            <p>Token Address: {this.props.tokenAddr}</p>
            <p>Start Time: <Timestamp time={this.props.startTime} format='full' /></p>
            <p>End Time: <Timestamp time={this.props.endTime} format='full' /></p>
        </div>
    )
  }
}

export default Form
