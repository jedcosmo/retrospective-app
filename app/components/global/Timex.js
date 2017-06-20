/*
 * @developer: jeromed.dymosco@domandtom.com
 * @date: April 24, 2017
 * Customized component for navigation timer of retro app.
 */
import React, { Component, PropTypes } from 'react';

class Timex extends React.Component {
  constructor(props){
    super(props);
    this.state = { remaining: null, endDate: null };    
    this.state.endDate = this.props.endDate;
  }

  dateBetween(startDate, endDate){
    var second = 1000;
    var minute = second * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var distance = endDate - startDate;

    if (distance < 0) {
      return false;
    }

    var days = Math.floor(distance / day);
    var hours = Math.floor(distance % day / hour);
    var minutes = Math.floor(distance % hour / minute);
    var seconds = Math.floor(distance % minute / second);

    var between = [];

    minutes > 0 ? between.push( ( minutes < 10 ? ('0'+ minutes) : minutes ) ) : between.push('00');
    seconds > 0 ? between.push( ( seconds < 10 ? ('0'+ seconds) : seconds ) ) : between.push('00');

    return between.join(':');
  }

  componentDidMount(){
    this.tick();
    this.interval = setInterval(this.tick.bind(this), 1000);
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }
  
  /*
   * This will make sure that timer will not reset everytime there are events made in share thoughts.
   */
  shouldComponentUpdate(nextProps){
    var storedEndDate = sessionStorage.getItem('endDate');    
    this.state.endDate = storedEndDate ? storedEndDate : this.props.endDate;
    
    return this.state.endDate;
  }

  tick(){
    var startDate = new Date();
    var endDate = new Date(this.state.endDate);    
    var remaining = this.dateBetween(startDate, endDate);
    
    //let's store the initial endDate timer once retrospective was started.
    if( !sessionStorage.getItem('endDate') ){
      sessionStorage.setItem('endDate', endDate);
    }
    
    if (remaining === false) {
      window.clearInterval(this.interval);
    }

    this.setState({
      remaining: remaining ? remaining : '00:00'
    });
  }

  render(){
    return(
      <div>{this.state.remaining}</div>
    );
  }

}

export default Timex;
