import React from 'react'
import Timestamp from 'react-timestamp';
import ProgressBar from 'react-progress-bar.js';

var Line = ProgressBar.Line;
var options = {
  strokeWidth: 2,
  easing: 'easeInOut',
  duration: 1400,
  color: '#00aa81',
  trailColor: '#01434f',
  trailWidth: 2,
  text: {
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      padding: '0px',
      margin: '0px',
      transform: 'translate(-50%, -50%)',
      fontSize: '20px',
      color: '#FFF'
    }
  }
};

class Form extends React.Component {
  render() {
    return (
      <div class='container stats-container'>
        <div class="row justify-content-between align-items-center" >
          <div class="col-lg-12 text-center">
            <h2>Progress</h2>
            <Line
              progress={this.props.progressBar}
              text={this.props.progressPercent + "%"}
              options={options}
              initialAnimate={true}
              containerClassName={'progress-bar'} />
          </div>
          <div class="data-container col-lg-3 text-center" >
            <p>Wei Raised: <strong>{this.props.weiRaised} / {this.props.cap}</strong></p>
            <p>Min Contribution: <strong>{this.props.minContribution}</strong></p>
            <p class="no-margin">Rate: <strong>{this.props.rate}</strong></p>
          </div>
          <div class="data-container col-lg-3 text-center" >
            <p>Contributors: <strong>{this.props.contributors}</strong></p>
            <p>Start Time: <strong><Timestamp time={this.props.startTime} format='full' /></strong></p>
            <p class="no-margin">End Time: <strong><Timestamp time={this.props.endTime} format='full' /></strong></p>
          </div>
          <div class="data-container col-lg-3 text-center" >
            <p>Has Ended: <strong>{this.props.hasEnded.toString()}</strong></p>
            <p>Sold Out: <strong>{this.props.soldOut.toString()}</strong></p>
            <p class="no-margin">Minting Finished: <strong>{this.props.mintingFinished.toString()}</strong></p>
          </div>
        </div>
      </div>
    )
  }
}

export default Form
