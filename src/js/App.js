/* jshint ignore:start */
import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import MeshCrowdsale from '../../build/contracts/MeshCrowdsale.json'
import Content from './Content'
import 'bootstrap/dist/css/bootstrap.css'
import '../css/style.css'

const config = require('../config')

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            rate: 0,
            cap: 0,
            contributors: -1,
            progressPercent: 0,
            progressBar: 0,
            minContribution: 0,
            startTime: 0,
            endTime: 0,
            weiRaised: 0,
            crowdsaleAddr: "0x0",
            walletAddr: "0x0",
            ownerAddr: "0x0",
            tokenAddr: "0x0",
            hasEnded: false,
            soldOut: false,
            mintingFinished: false,
            whitelistingAgents: [],
            successTransfers: [],
            advanced: false,
            transactions: {} //{txHash, from, value, status, block, timestamp(age)}
        }

        if (typeof web3 != 'undefined') {
            this.web3Provider = web3.currentProvider
        } else {
            this.web3Provider = new Web3.providers.HttpProvider(config.httpProvider)
        }

        if(config.noMetamask) {
            console.log("noMetamask")
            this.web3Provider = new Web3.providers.HttpProvider(config.httpProvider)
        }

        this.web3 = new Web3(this.web3Provider)


        this.crowdsale = TruffleContract(MeshCrowdsale)
        this.crowdsale.setProvider(this.web3Provider)
    }

    componentDidMount() {
        this.crowdsale.at(config.crowdsaleAddress).then((instance) => {
            this.crowdsaleInstance = instance
            this.setState({crowdsaleAddr: instance.address})

            this.crowdsaleInstance.wallet.call().then((walletAddr) => {this.setState({ walletAddr: walletAddr })})
            this.crowdsaleInstance.owner.call().then((ownerAddr) => {this.setState({ ownerAddr: ownerAddr })})
            this.crowdsaleInstance.token.call().then((tokenAddr) => {this.setState({ tokenAddr: tokenAddr })})

            this.crowdsaleInstance.startTime.call().then((startTime) => {
                this.setState({ startTime: startTime.toNumber() })
            })
            this.crowdsaleInstance.endTime.call().then((endTime) => {
                this.setState({ endTime: endTime.toNumber() })
            })

            this.crowdsaleInstance.cap.call().then((cap) => {this.setState({ cap: cap.dividedBy(10**18).toNumber() })})
            this.crowdsaleInstance.rate.call().then((rate) => {this.setState({ rate: rate.toNumber() })})
            this.crowdsaleInstance.minimumContribution.call().then((minContribution) => {
                this.setState({ minContribution: minContribution.dividedBy(10**18).toNumber() })
            })

            this.fetchWeiRaised()

            this.setState({loading: false})
            this.watchContractEvents()

            this.pollEndedAndMintingFinished(this.crowdsaleInstance)

            //If advanced, get incoming transactions details.
            if(config.advanced) {
                this.setState({advanced: true})
                this.web3.eth.getBlockNumber((error, blockNumber) => {
                    if(error) {
                        console.log(error)
                    } else {
                        this.lastBlockNumber = blockNumber
                        this.getMinedTransactionsMultiBlocks(this.lastBlockNumber - 5, this.lastBlockNumber);
                    }
                })

                this.watchLatestBlock()

                //If run with ethereum full synced node, get data from tx pool.
                if(config.noMetamask) {
                    //this.getTxPoolTransactions()
                    this.watchPendingTransactions()
                }
            }

        }).catch(function(error) {
            console.error(error)
        })
    }

    pollEndedAndMintingFinished() {
        this.crowdsaleInstance.mintingFinished.call().then((mintingFinished) =>
                        {this.setState({mintingFinished: mintingFinished})})

        this.crowdsaleInstance.hasEnded.call().then((hasEnded) => {this.setState({ hasEnded: hasEnded })})

        setTimeout(() => {this.pollEndedAndMintingFinished()}, config.pollInterval);
    }

    checkSoldOut(ethRaised) {
        var delta = this.state.cap - ethRaised
        delta = this.precisionRound(delta, 4)
        console.log("Sold out delta: " + delta)
        console.log("min: " + this.state.minContribution)
        if(delta < this.state.minContribution) {
            console.log("--> sold out!")
            this.setState({ soldOut: true })
        }
    }

    fetchWeiRaised() {
        this.crowdsaleInstance.weiRaised.call().then((weiRaised) => {
            const ethRaised = this.precisionRound(weiRaised.dividedBy(10**18).toNumber(), 4)
            this.setState({ weiRaised: ethRaised })
            this.setState({ progressPercent: Math.round(((ethRaised / this.state.cap)*100)*100)/100 })
            this.setState({ progressBar: Math.round(((ethRaised / this.state.cap)*100)*100)/10000 })
            this.setState((prevState) => { return { contributors: prevState.contributors + 1 }})

            this.checkSoldOut(ethRaised)
        }).catch(function(error) {
            console.error(error)
        })
    }

    precisionRound(number, precision) {
        var shift = function (number, exponent) {
            var numArray = ("" + number).split("e")
            return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + exponent) : exponent))
        }

        return shift(Math.round(shift(number, +precision)), -precision)
    }

    //TODO: test this method
    getTxPoolTransactions() {
        this.web3._extend({
            property: 'txpool',
            methods: [new web3._extend.Method({
                name: 'content',
                call: 'txpool_content'
            })]
        })

        this.web3.txpool.content((error, res) => {
            Object.keys(res.pending).forEach(function(key) {
                console.log(key, res.pending[key]);
            })
        })
    }

    appendPendingTransaction(txHash) {
        //console.log("check for pending: " + txHash)
        this.web3.eth.getTransaction(txHash, (error, transaction) => {
            if (error) {
                console.log("error: " + error)
            } else {
                if(transaction === null) {
                    console.log("Pending transaction is null.")
                } else if (config.testTransactions || transaction.to == this.crowdsaleInstance.address) {
                    console.log("pending: " + JSON.stringify(transaction))
                    var transactions = this.state.transactions
                    transactions[txHash] = {
                        txHash: txHash,
                        from: transaction.from,
                        value: this.precisionRound(transaction.value.dividedBy(10**18).toNumber(), 2),  //to ether
                        status: "pending",
                        block: -1,
                        timestamp: Math.floor(Date.now() / 1000)}
                    this.setState(transaction: transaction)
                }
            }
        })
    }

    appendMinedTransaction(txHash, value, blockTimestamp) {
        this.web3.eth.getTransactionReceipt(txHash, (error, transaction) => {
            if(error) {
                console.log("error: " + error)
            } else {
                if(transaction == null) {
                    //TODO: store in memory and try to fetch later
                    console.log("Metamask returned a null for: " + txHash)
                } else {
                    //console.log(transaction)
                    var transactions2 = this.state.transactions
                    transactions2[txHash] = {
                        txHash: txHash,
                        from: transaction.from,
                        value: this.precisionRound(value.dividedBy(10**18).toNumber(), 2),  //to ether
                        status: transaction.status == "0x1" ? "OK" : "Failed",
                        block: transaction.blockNumber,
                        timestamp: blockTimestamp}

                    this.setState({transactions: transactions2})
                }
            }
        })
    }

    watchPendingTransactions() {
        this.web3.eth.filter("pending").watch((error, newPending) => {
            if (error) {
                console.log("error: " + error)
            } else {
                if (newPending in this.state.transactions) {
                    console.log("duplicate pending transaction.")
                    return
                }

                this.appendPendingTransaction(newPending)
            }
        })
    }

    getMinedTransactions(block) {
        //console.log(block)
        block.transactions.forEach(transaction => {
            if (config.testTransactions || transaction.to == this.crowdsaleInstance.address) {
                this.appendMinedTransaction(transaction.hash, transaction.value, block.timestamp)
            }
        })
    }

    getMinedTransactionsMultiBlocks(fromBlock, toBlock) {
        for(var i = fromBlock; i <= toBlock; i++) {
            this.web3.eth.getBlock(i, true, (error, block) => {
                if(error) {
                    console.log("error: " + error)
                } else {
                    this.getMinedTransactions(block)
                }
            })
        }
    }

    watchLatestBlock() {
        //TODO: check this
        //filter.stopWatching()
        this.web3.eth.filter("latest").watch((error, blockHash) => {
            if(error) {
                console.log("error: " + error)
            } else {
                this.web3.eth.getBlock(blockHash, true, (error, block) => {
                    if(error) {
                        console.log("error: " + error)
                    } else {
                        this.getMinedTransactions(block)
                    }
                })
            }
        })
    }

    watchContractEvents() {
        var event = this.crowdsaleInstance.TokenPurchase({}, {
            fromBlock: 0,
            toBlock: 'latest'
        })

        event.watch((error, event) => {
            if(error) {
                console.log("error: " + error)
            } else {
                //console.log("--> event: " + JSON.stringify(event))
                //event.forEach(log => console.log(log.args))
                this.fetchWeiRaised()

                this.setState({successTransfers: [...this.state.successTransfers, {
                    from: event.args.purchaser,
                    ether: this.precisionRound(event.args.value.dividedBy(10**18).toNumber(), 2),
                    tokens: this.precisionRound(event.args.amount.dividedBy(10**18).toNumber(), 2),
                    blockNumber: event.blockNumber
                }]
                })
            }
        })
    }

    render() {
        return (
          <div>
              { this.state.loading
                  ? <p class='text-center'>Loading...</p>
                  : <Content
                      weiRaised={this.state.weiRaised}
                      rate = {this.state.rate}
                      cap = {this.state.cap}
                      contributors = {this.state.contributors}
                      progressPercent = {this.state.progressPercent}
                      progressBar = {this.state.progressBar}
                      minContribution = {this.state.minContribution}
                      mintingFinished = {this.state.mintingFinished}
                      hasEnded = {this.state.hasEnded}
                      soldOut = {this.state.soldOut}
                      walletAddr = {this.state.walletAddr}
                      ownerAddr = {this.state.ownerAddr}
                      tokenAddr = {this.state.tokenAddr}
                      crowdsaleAddr = {this.state.crowdsaleAddr}

                      startTime = {this.state.startTime}
                      endTime = {this.state.endTime}

                      advanced = {this.state.advanced}
                      successTransfers = {this.state.successTransfers}
                      transactions = {this.state.transactions} />
              }
        </div>
        )
    }
}

ReactDOM.render(
   <App />,
   document.querySelector('#root')
)
