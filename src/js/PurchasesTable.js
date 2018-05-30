import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import _ from "lodash";

class PurchasesTable extends React.Component {
    render() {
      var transferData = this.props.successTransfers;

      const transferColumns = [{
          Header: 'From',
          accessor: 'from',
          width: 400,
          Footer: (
            <span>
              <strong>Average Contribution: </strong>{" "}
              {_.round(_.mean(_.map(transferData, d => d.ether)), 2)} ETH
            </span>
          )
        }, {
          Header: 'Ether',
          accessor: 'ether',
        }, {
          Header: 'Tokens',
          accessor: 'tokens'
        }, {
          Header: 'Block',
          accessor: 'blockNumber'
        }];

        return (
          <div class='container'>
            <div class="row">
              <div class="col-lg-12 no-padding">
                <ReactTable
                  data={transferData}
                  columns={transferColumns}
                  defaultSorted={[
                    {
                      id: "blockNumber",
                      desc: true
                    }
                  ]}
                  defaultPageSize={10}
                  className="-striped -highlight"
                />
              </div>
            </div>
          </div>
        )
    }
}

export default PurchasesTable
