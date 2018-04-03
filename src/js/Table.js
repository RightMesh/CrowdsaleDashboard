import React from 'react'

class Table extends React.Component {
    render() {
        return (
            <div>
            <table class='table'>
                <thead>
                    <tr>
                        <th>From</th>
                        <th>Ether</th>
                        <th>Tokens</th>
                        <th>Block Number</th>
                    </tr>
                </thead>
                <tbody >
                    {this.props.successTransfers.map((transfer) => {
                        return(
                            <tr>
                                <td>{transfer.from}</td>
                                <td>{transfer.ether}</td>
                                <td>{transfer.tokens}</td>
                                <td>{transfer.blockNumber}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </div>
        )
    }
}

export default Table
