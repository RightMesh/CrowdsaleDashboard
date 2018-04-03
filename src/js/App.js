import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import MeshCrowdsale from '../../build/contracts/MeshCrowdsale.json'
import Content from './Content'
import 'bootstrap/dist/css/bootstrap.css'

const config = require('../config');

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            rate: 0,
            cap: 0,
            minContribution: 0,
            startTime: 0,
            endTime: 0,
            weiRaised: 0,
            crowdsaleAddr: "0x0",
            walletAddr: "0x0",
            ownerAddr: "0x0",
            tokenAddr: "0x0",
            hasEnded: false,
            mintingFinished: false,
            whitelistingAgents: [],
            successTransfers: [],
        }

        if (typeof web3 != 'undefined') {
            this.web3Provider = web3.currentProvider
            console.log(this.web3Provider)
        } else {
            console.log("undefined")
            this.web3Provider = new Web3.providers.HttpProvider(config.httpProvider)
            console.log(this.web3Provider)
        }

        this.web3 = new Web3(this.web3Provider)

        this.crowdsale = TruffleContract(MeshCrowdsale)
        this.crowdsale.setProvider(this.web3Provider)

        //this.watchContractEvents = this.watchContractEvents.bind(this)
        //this.watchWebSocketsEvents = this.watchWebSocketsEvents.bind(this)
    }

    componentDidMount() {
        this.webSocketConn = new WebSocket(config.webSocketAddress)
        this.watchWebSocketsEvents()

        this.crowdsale.at(config.crowdsaleAddress).then((instance) => {
            this.crowdsaleInstance = instance
            this.setState({crowdsaleAddr: instance.address})

            this.crowdsaleInstance.hasEnded.call().then((hasEnded) => {this.setState({ hasEnded: hasEnded })})
            this.crowdsaleInstance.mintingFinished.call().then((mintingFinished) =>
                {this.setState({mintingFinished: mintingFinished})})

            this.crowdsaleInstance.wallet.call().then((walletAddr) => {this.setState({ walletAddr: walletAddr })})
            this.crowdsaleInstance.owner.call().then((ownerAddr) => {this.setState({ ownerAddr: ownerAddr })})
            this.crowdsaleInstance.token.call().then((tokenAddr) => {this.setState({ tokenAddr: tokenAddr })})

            this.crowdsaleInstance.startTime.call().then((startTime) => {
                this.setState({ startTime: startTime.toNumber() })
            })
            this.crowdsaleInstance.endTime.call().then((endTime) => {
                this.setState({ endTime: endTime.toNumber() })
            })

            this.crowdsaleInstance.cap.call().then((cap) => {this.setState({ cap: cap.toNumber() / (10**18) })})
            this.crowdsaleInstance.rate.call().then((rate) => {this.setState({ rate: rate.toNumber() })})
            this.crowdsaleInstance.minimumContribution.call().then((minContribution) => {
                this.setState({ minContribution: minContribution.toNumber() / (10**18) })
            })

            this.fetchWeiRaised()
            this.setState({loading: false})
            this.watchContractEvents()
        }).catch(function(error) {
            console.error(error)
        })
    }

    fetchWeiRaised() {
        this.crowdsaleInstance.weiRaised.call().then((weiRaised) => {
            this.setState({ weiRaised: weiRaised.toNumber() / (10**18) })
        }).catch(function(error) {
            console.error(error)
        })
    }

    proccessTxlist(data) {
        //TODO
        console.log(data)
    }

    proccessSubscribeResponse(data) {
        //TODO
        console.log(data)
    }

    proccessWelcome(data) {
        console.log(data)
        this.webSocketConn.send(JSON.stringify({"event": "txlist", "address": config.crowdsaleAddress}))
        setInterval(() => {this.webSocketConn.send(JSON.stringify({"event": "ping"}))}, config.webSocketPingTime)
    }

    watchWebSocketsEvents() {
        // listen to onmessage event
        this.webSocketConn.onmessage = (evt) => {
            var response = JSON.parse(evt.data)
            if("event" in response) {
                switch(response.event) {
                    case "pong":
                        console.log(evt)
                        break
                    case "welcome":
                        this.proccessWelcome(response)
                        break
                    case "subscribe-txlist":
                        this.proccessSubscribeResponse(response)
                        break
                }
            }
        }
    }

    watchContractEvents() {
        var event = this.crowdsaleInstance.TokenPurchase({}, {
            fromBlock: 0,
            toBlock: 'latest'
        })

        event.watch((error, event) => {
            if(error) {
                console.log("error: " + error)
            }
            else {
                console.log("--> event: " + JSON.stringify(event))
                //event.forEach(log => console.log(log.args))
                this.fetchWeiRaised()
                this.setState({successTransfers: [...this.state.successTransfers, {
                    from: event.args.purchaser,
                    ether: event.args.value.toNumber() / (10**18),
                    tokens: event.args.amount.toNumber() / (10**18),
                    blockNumber: event.blockNumber
                }]
                })
            }
        })
    }

    render() {
        return (
            <div class='row'>
                <div class='col-lg-12 text-center' >
                    <h1>Dashboard</h1>
                    <br/>
                    <hr/>
                    { this.state.loading
                        ? <p class='text-center'>Loading...</p>
                        : <Content
                            weiRaised={this.state.weiRaised}
                            rate = {this.state.rate}
                            cap = {this.state.cap}
                            minContribution = {this.state.minContribution}
                            mintingFinished = {this.state.mintingFinished}
                            hasEnded = {this.state.hasEnded}
                            walletAddr = {this.state.walletAddr}
                            ownerAddr = {this.state.ownerAddr}
                            tokenAddr = {this.state.tokenAddr}

                            startTime = {this.state.startTime}
                            endTime = {this.state.endTime}

                            successTransfers = {this.state.successTransfers} />
                    }
                </div>
            </div>
        )
    }
}

ReactDOM.render(
   <App />,
   document.querySelector('#root')
)