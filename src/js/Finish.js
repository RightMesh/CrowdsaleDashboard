import React from 'react';

class Finish extends React.Component {
    render() {
        return (
          <div class='container'>
            <div class="row align-items-center">

              <div class="col-lg-2 text-center">
                <i class="em-svg em-champagne em-champagne-left"></i>
                <i class="em-svg em-champagne em-champagne-left"></i>
                <i class="em-svg em-champagne em-champagne-left"></i>
              </div>
              <div class="col-lg-8 no-padding video">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/LaTGrV58wec?rel=0&amp;controls=0&amp;showinfo=0;&autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                <img class="video" src="../img/alandance.gif"/>
              </div>
              <div class="col-lg-2 text-center">
                <i class="em-svg em-champagne em-champagne-right"></i>
                <i class="em-svg em-champagne em-champagne-right"></i>
                <i class="em-svg em-champagne em-champagne-right"></i>
              </div>

            </div>
          </div>
        )
    }
}

export default Finish
