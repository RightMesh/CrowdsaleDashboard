import React from 'react'
import Table from './Table'
import Form from './Form'

class Content extends React.Component {
    render() {
        return (
            <div>
                <Form
                    weiRaised={this.props.weiRaised}
                    rate = {this.props.rate}
                    cap = {this.props.cap}
                    minContribution = {this.props.minContribution}
                    mintingFinished = {this.props.mintingFinished}
                    hasEnded = {this.props.hasEnded}
                    walletAddr = {this.props.walletAddr}
                    ownerAddr = {this.props.ownerAddr}
                    tokenAddr = {this.props.tokenAddr}
                    startTime = {this.props.startTime}
                    endTime = {this.props.endTime} />
                <hr/>
                <Table successTransfers={this.props.successTransfers} />
            </div>
        )
    }
}

export default Content