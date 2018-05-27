import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import _ from "lodash";

class TransactionsTable extends React.Component {
  render() {
      if(this.props.transactions == null) {
        return
      }

      var transactionData = Object.keys(this.props.transactions).map(key => {
          return {
            from: this.props.transactions[key].from,
            value: this.props.transactions[key].value,
            status: this.props.transactions[key].status,
            timestamp: this.props.transactions[key].timestamp,
            block: this.props.transactions[key].block
          }
      })

      const transactionColumns = [{
          Header: 'From',
          accessor: 'from',
          width: 400,
          Footer: (
            <span>
              <strong>Average Contribution: </strong>{" "}
              {_.round(_.mean(_.map(transactionData, d => d.value)), 2)} ETH
            </span>
          )
        }, {
          Header: 'Value',
          accessor: 'value'
        }, {
          Header: 'Status',
          accessor: 'status'
        }, {
          Header: 'Age',
          accessor: 'timestamp',
          Cell: ({row}) => (
            <div>
                {Math.floor((((new Date).getTime()/1000) - row.timestamp) / 3600)} h {Math.floor(((((new Date).getTime()/1000) - row.timestamp) % 3600) / 60)} m {(((Math.floor((new Date).getTime()/1000)) - row.timestamp) % 60)} s
            </div>
          )
        }, {
          Header: 'Block',
          accessor: 'block'
        }];

        return (
          //txHash, from, value, status, block, timestamp(age)
          <div class='container'>
            <div class="row">
              <div class="col-lg-12 no-padding">
                <ReactTable
                  textAlign = "center"
                  data={transactionData}
                  columns={transactionColumns}
                  defaultSorted={[
                    {
                      id: "block",
                      desc: true
                    }
                  ]}
                  defaultPageSize={25}
                  className="-striped -highlight"
                />
              </div>
            </div>
          </div>
        )
    }
}

export default TransactionsTable
