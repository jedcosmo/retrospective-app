import React from 'react';

class Timer extends React.Component {  
  constructor (props) {
    super(props)
    this.state = {
      timeRemaining: this.props.initialTimeRemaining,
      timeoutId: null,
      prevTime: null,
      isMounted: true
    };
  }

  componentDidMount() {
    this.tick();
  }

  componentWillReceiveProps (newProps) {
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId);
    }
    if (this.state.isMounted) {
      this.setState({prevTime: null, timeRemaining: newProps.initialTimeRemaining});
    }
  }

  componentDidUpdate () {
    if ((!this.state.prevTime) && this.state.timeRemaining > 0 && this.state.isMounted) {
      this.tick();
    }
  }

  componentWillUnmount () {
    this.setState({isMounted: false});
    clearTimeout(this.state.timeoutId);
  }

  tick () {
    const currentTime = Date.now();
    const dt = this.state.prevTime ? (currentTime - this.state.prevTime) : 0;
    const interval = this.props.interval;

    // correct for small variations in actual timeout time
    const timeRemainingInInterval = (interval - (dt % interval));
    let timeout = timeRemainingInInterval;

    if (timeRemainingInInterval < (interval / 2.0)) {
      timeout += interval;
    }

    const timeRemaining = Math.max(this.state.timeRemaining - dt, 0);
    const countdownComplete = (this.state.prevTime && timeRemaining <= 0);

    if (this.state.isMounted) {
      if (this.state.timeoutId) {
        clearTimeout(this.state.timeoutId);
      }
      this.setState({
        timeoutId: countdownComplete ? null : setTimeout(this.tick.bind(this), timeout),
        prevTime: currentTime,
        timeRemaining: timeRemaining
      });
    }

    if (countdownComplete) {
      if (this.props.completeCallback) {
        this.props.completeCallback();
      }
      return;
    }

    if (this.props.tickCallback) {
      this.props.tickCallback(timeRemaining);
    }
  }

  getFormattedTime (milliseconds) {
    if (this.props.formatFunc) {
      return this.props.formatFunc(milliseconds);
    }

    var totalSeconds = Math.round(milliseconds / 1000);

    var seconds = parseInt(totalSeconds % 60, 10);
    var minutes = parseInt(totalSeconds / 60, 10) % 60;
    var hours = parseInt(totalSeconds / 3600, 10);

    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    hours = hours < 10 ? '0' + hours : hours;

    return hours + ':' + minutes + ':' + seconds;
  }

  render () {
    var timeRemaining = this.state.timeRemaining;
    return (
      <div className='timer'>
        {this.getFormattedTime(timeRemaining)}
      </div>
    )
  }
}

Timer.defaultProps = {
  interval: 1000,
  formatFunc: null,
  tickCallback: null,
  completeCallback: null
}

Timer.propTypes = {
  initialTimeRemaining: React.PropTypes.number.isRequired,
  interval: React.PropTypes.number,
  formatFunc: React.PropTypes.func,
  tickCallback: React.PropTypes.func,
  completeCallback: React.PropTypes.func,
}

export default Timer;
