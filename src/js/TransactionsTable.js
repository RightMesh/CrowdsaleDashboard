import React from 'react'

class TransactionsTable extends React.Component {
    render() {
        return (
            //txHash, from, value, status, block, timestamp(age)
            <div class='container'>
              <div class="row">
                <div class="col-lg-6 col-md-12">
                  <table id='contributionsTable' class='table'>
                      <thead>
                          <tr>
                              <th>From</th>
                              <th>Value</th>
                              <th>Status</th>
                              <th>Age</th>
                              <th>Block</th>
                          </tr>
                      </thead>
                      <tbody >
                          {Object.keys(this.props.transactions).map(key => {
                              return(
                              <tr>
                                  <td>{this.props.transactions[key].from}</td>
                                  <td>{this.props.transactions[key].value}</td>
                                  <td>{this.props.transactions[key].status}</td>
                                  <td>{this.props.transactions[key].timestamp}</td>
                                  <td>{this.props.transactions[key].block}</td>
                              </tr>
                              )
                          })}
                      </tbody>
                  </table>
                </div>
              </div>
            </div>
        )
    }
}

export default TransactionsTable
