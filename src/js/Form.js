import React from 'react'
import Timestamp from 'react-timestamp';

var ProgressBar = require('react-progress-bar.js');
//import ProgressBar from 'react-progressbar.js'
var Line = ProgressBar.Line;
var options = {
  strokeWidth: 3,
  easing: 'easeInOut',
  duration: 1400,
  color: '#00aa81',
  trailColor: '#01434f',
  trailWidth: 3,
  text: {
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      padding: '0px',
      margin: '0px',
      transform: 'translate(-50%, -50%)',
      fontSize: '24px',
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
          <div class="data-container col-lg-3 card-side text-center" >
              <p>Min Contribution: <strong>{this.props.minContribution}</strong></p>
              <p>Rate: <strong>{this.props.rate}</strong></p>
              <p class="no-margin">Minting Finished: <strong>{this.props.mintingFinished.toString()}</strong></p>
          </div>
          <div class="data-container col-lg-3 text-center" >
              <h3 class="card-title">Wei Raised:</h3>
              <h3 class="card-stat double-margin">{this.props.weiRaised} / {this.props.cap}</h3>
              <h3 class="card-title">Contributors:</h3>
              <h3 class="card-stat">{this.props.contributors}</h3>
          </div>
          <div class="data-container col-lg-3 card-side text-center" >
              <p>Has Ended: <strong>{this.props.hasEnded.toString()}</strong></p>
              <p>Start Time: <strong><Timestamp time={this.props.startTime} format='full' /></strong></p>
              <p class="no-margin">End Time: <strong><Timestamp time={this.props.endTime} format='full' /></strong></p>
          </div>
        </div>
      </div>
    )
  }
}

export default Form
