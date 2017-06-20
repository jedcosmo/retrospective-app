import React from 'react';
import {Link} from 'react-router';
import FooterStore from '../../stores/FooterStore';
import FooterActions from '../../actions/FooterActions';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = FooterStore.getState();
    this.onChange = this.onChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    FooterStore.listen(this.onChange);
  }

  componentWillUnmount() {
    FooterStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleClick(e) {
    e.preventDefault();
    let nextStep;
    if(this.props.currentStage == "share") {
      nextStep = 'group';
    }
    else if(this.props.currentStage == "group") {
      nextStep = 'vote';
    }
    else if(this.props.currentStage == "vote") {
      nextStep = 'votereview';
    }
    else if(this.props.currentStage == "votereview") {
      nextStep = 'archive';
    }
    this.props.setStage(nextStep);
  }

  render() {
    let leaderboardThoughts = null;
    //console.log('footer_' + this.props.currentStage);
    if(this.props.roomCode) {
     //make sure that CTA buttons should be visible only for admin and don't show it to attendee levels.
     if(this.props.isAdmin && this.props.currentStage != "setup") {
        //admin level CTA buttons starts here.
        if(this.props.currentStage == "vote") {
          let countUsersNotFinishedVoting = this.props.retroJoinedUsers.length - this.props.usersFinishedVote.length;
          return(
            <footer className='is-admin'>
                <div className="user-finish-container"> <span className='finished-votes-ctr'>{countUsersNotFinishedVoting}</span> Attendees have not finished voting <hr className='footer' /></div>
                <a href="#" onClick={this.handleClick} className='footer-btn'>{this.props.linkLabel} &#8594;</a>
              </footer>
          );
        }
        else {
          return(
            <footer classNam='is-admin'>
                  <a href="#" onClick={this.handleClick} className='footer-btn'>{this.props.linkLabel} &#8594;</a>
            </footer>
          );
        }
      }else{
        return(<div></div>);
      }

    }else {
      return (
        <footer>
          <div>
            <div>
              <div className='col-md-6 company-wrapper'>
                <span>&copy; 2017 <span className="company-name">Dom &amp; Tom</span></span>
              </div>
              <div className='col-md-6 hidden-xs social'>
                <a href='#'><i className='fa fa-linkedin'></i></a>
                <a href='#'><i className='fa fa-instagram'></i></a>
                <a href='#'><i className='fa fa-facebook'></i></a>
                <a href='#'><i className='fa fa-twitter'></i></a>
              </div>
            </div>
          </div>
        </footer>
      );
    }
  }
}

export default Footer;
