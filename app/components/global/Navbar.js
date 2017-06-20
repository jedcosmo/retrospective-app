import React from 'react';
import {Link} from 'react-router';
import AuthService from '../../../utils/AuthService';
import NavbarStore from '../../stores/NavbarStore';
import NavbarActions from '../../actions/NavbarActions';
import Timex from '../global/Timex';

var _ = require('underscore');

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = NavbarStore.getState();
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.showLock = this.showLock.bind(this);
    this.showAttendees = this.showAttendees.bind(this);
    this.hideAttendees = this.hideAttendees.bind(this);
  }

  componentDidMount() {
    NavbarStore.listen(this.onChange);

    // TODO: when we share socket via singleton, we can resolve this
    // NavbarActions.updateAjaxAnimation('fadeIn');

    // let socket = io.connect();

    // socket.on('updateRetroUsers', (data) => {
    //   NavbarActions.updateRetroUsers(data);
    //   NavbarActions.updateAjaxAnimation('fadeOut');
    // });

    // Disable authentication for now
    // For login authentication
    /*if(!this.props.notLogin){
      this.createLock();
      if (this.lock.getToken() === null || this.lock.getToken() === undefined) {
        this.showLock();
      } else {
        if(this.refs.signInLink){
          this.refs.signInLink.innerHTML = 'Logout';
          console.log(this.lock.getToken());
        }
      }
    }*/
  }

  componentWillUnmount() {
    NavbarStore.unlisten(this.onChange);
  }

  createLock() {
    this.lock = new AuthService(window.location.href);
  }

  onClick(state) {
    this.setState(state);
  }

  onChange(state) {
    this.setState(state);
  }

  showLock() {
    this.loggingOut();
    this.lock.login();
  }

  isSignedIn() {
    return this.lock.loggedIn();
  }

  auth() {
    if (this.lock.getToken() === null || this.lock.getToken() === undefined) {
      this.showLock();

    } else {
      if(this.refs.signInLink){
        this.refs.signInLink.innerHTML = 'Logout';
        console.log(this.lock.getToken());
      }
    }
  }

  loggingOut() {
    if(this.refs.signInLink){
      this.lock.logout();
      this.refs.signInLink.innerHTML = 'Sign In';
    }
  }

  showAttendees() {    
    if(!this.props.isAdmin) {
      return;
    }else{
      if(this.props.stage == 'vote') {
        $('.attendee-list').fadeIn();
      }
    }        
  }

  hideAttendees() {
    if(!this.props.isAdmin) {
      return;
    }
    
    $('.attendee-list').fadeOut();
  }

  listAttendeesVoteCount() {

    let attendeesVoteCount = _.map(this.props.retroJoinedUsers, (users, index) => {
      let votesArray = [];
        this.props.thoughts.map(( thought, index) => {
          if(_.indexOf(thought.votes, users) >= 0) {
            votesArray.push(users);
          }
        })
      let admin_icon = null;
        
        if(this.props.isAdmin && this.props.joinName == users) {
          admin_icon = <i>A</i>;
        }

        return (
          <div className='col-sm-1 attendee-vote-count'>
            <div>{votesArray.length} of 3</div>
            <span className='user-name'>{users} {admin_icon}</span>
          </div>
        )
    });

    return attendeesVoteCount;
  }

  showWhichNavbar(){

    //this will return the proper header navigation for the retro app share thoughts page.
    if(this.props.roomCode){
      var navDate = new Date();
      let timer = parseInt(this.props.retroTimer);
      let default_timer = (timer < 10 ? '0' + timer : timer) + ':00'; //when retro still not started use this.
      let timex = default_timer;

      navDate = navDate.setMinutes(navDate.getMinutes() + timer);
      let hideTimer = true;
      let hideVote = true;
      let hideWrapper = true;
      let isDone = false;
      let attendees_txt = 'Attendee';

      if(this.props.stage == 'share') {
        timex = <Timex endDate={ navDate } />
        hideTimer = false;
        hideVote = true;
      }
      if(this.props.stage == 'group') {
        hideTimer = true;
        hideVote = true;
      }
      else if(this.props.stage == 'vote') {
        hideTimer = true;
        hideVote = false;
      }

      let votesArray = [];
      _.map(this.props.thoughts, (thought, index) => {
        if(_.indexOf(thought.votes, localStorage.getItem('username')) >= 0) {
          votesArray.push(localStorage.getItem('username'));
        }
      });

      let votesCasted = votesArray.length;
      let votesAllowed = this.props.votesMax - votesArray.length;

      if(votesAllowed == 0) {
        isDone = true;
      }
      
      if( _.keys( this.props.retroJoinedUsers ).length > 1) {
        attendees_txt = 'Attendees';
      }
      
      return(
        <nav className='navbar navbar-default navbar-static-top'>
            <div className='navbar-header'>
                <Link to='/' className='navbar-brand'>RETROSPECTIVE APPLICATION</Link>
            </div>
            <div className='col-md-12 nav-header-details-category-lists'>
              <div className="col-md-5 project-name">
                <div className='nav-retro-datails'>{this.props.retroTitle} Sprint # {this.props.retroSprint}</div>
              </div>
              <div className="col-md-5">
                <div className='nav-title'>{this.props.stageTitle}</div>
              </div>
              <div className="col-md-1 retro-wrapper">
                <div className='retro-timer-end'></div>
                <div style={{ display: hideTimer ? 'none' : 'inline' }} className='retro-timer'>{timex}</div>
                <div style={{ display: hideVote ? 'none' : 'inline' }} className='vote-wrapper'>

                  { isDone ? <p className='vote-done'>{votesCasted} / {this.props.votesMax}</p> : <p className='vote-done'>{votesCasted} of {this.props.votesMax}</p>}
                  { isDone ? <p className='vote-remaining'>All Done!</p> : <p className='vote-remaining'>{votesAllowed} { (votesAllowed > 1) ? 'votes' : 'vote'} remaining</p>}

                </div>
              </div>
              <div className="col-md-1 attendees-indicator">
                <div id='navbar' className='navbar-collapse collapse'>
                    <div className='nav navbar-nav navbar-right'>
                      <div className='retro-numbers' onMouseEnter={this.showAttendees} onMouseLeave={this.hideAttendees} >
                        <svg width="20" height="20" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M529 896q-162 5-265 128h-134q-82 0-138-40.5t-56-118.5q0-353 124-353 6 0 43.5 21t97.5 42.5 119 21.5q67 0 133-23-5 37-5 66 0 139 81 256zm1071 637q0 120-73 189.5t-194 69.5h-874q-121 0-194-69.5t-73-189.5q0-53 3.5-103.5t14-109 26.5-108.5 43-97.5 62-81 85.5-53.5 111.5-20q10 0 43 21.5t73 48 107 48 135 21.5 135-21.5 107-48 73-48 43-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-1024-1277q0 106-75 181t-181 75-181-75-75-181 75-181 181-75 181 75 75 181zm704 384q0 159-112.5 271.5t-271.5 112.5-271.5-112.5-112.5-271.5 112.5-271.5 271.5-112.5 271.5 112.5 112.5 271.5zm576 225q0 78-56 118.5t-138 40.5h-134q-103-123-265-128 81-117 81-256 0-29-5-66 66 23 133 23 59 0 119-21.5t97.5-42.5 43.5-21q124 0 124 353zm-128-609q0 106-75 181t-181 75-181-75-75-181 75-181 181-75 181 75 75 181z"/></svg>
                        <p>{ _.keys( this.props.retroJoinedUsers ).length } { attendees_txt }</p>
                      </div>
                    </div>
                </div>
              </div>
              <div className='attendee-list'>
                  {this.listAttendeesVoteCount()}
              </div>
            </div>
        </nav>
      );
    } else {
      return (
        <nav className='navbar navbar-default no-border navbar-static-top'>
            <div className='navbar-header'>
                <Link to='/' className='navbar-brand'>RETROSPECTIVE APPLICATION</Link>
            </div>
        </nav>
      );
    }

  }

  render() {
    return(
      <div>
        {this.showWhichNavbar()}
      </div>
    );
  }
}

export default Navbar;
