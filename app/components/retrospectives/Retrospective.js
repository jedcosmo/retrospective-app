import React from 'react';
import AuthService from '../../../utils/AuthService';
import RetrospectiveHeader from './RetrospectiveHeader';
import RetrospectiveStore from '../../stores/RetrospectiveStore';
import RetrospectiveActions from '../../actions/RetrospectiveActions';
import {clone} from 'underscore';
import Navbar from '../global/Navbar';
import { RetrospectiveStage } from './RetrospectiveStageTypes';
import RetrospectiveCategoryList from './RetrospectiveCategoryList';
import RetrospectiveCreate from './RetrospectiveCreate';
import RetrospectiveLanding from './RetrospectiveLanding';
import RetrospectiveSummary from './RetrospectiveSummary';

class Retrospective extends React.Component {
  constructor(props) {
    super(props);
    this.state = RetrospectiveStore.getState();
    this.onChange = this.onChange.bind(this);

    this.renderThoughtStage = false;

    this.socket = null;

    //Additional states for the added/imported retrospective child components.
    this.state.showModal = false;
    this.state.resetCreateForm = false;
    this.handleLandingJoinRetro = this.handleLandingJoinRetro.bind(this);
    this.handleCreateRetro = this.handleCreateRetro.bind(this);
    this.handleRetroStarted = this.handleRetroStarted.bind(this);
    this.handleOnSaveClose = this.handleOnSaveClose.bind(this);
  }

  componentDidMount() {  
    //this will handle the cleaning of session storage of timer endDate variable.
    sessionStorage.removeItem("endDate");
    
    RetrospectiveStore.listen(this.onChange);

    if(this.props.params.roomcode){
      RetrospectiveActions.getRetrospective(this.props.params.roomcode);
    }

    this.socket = io.connect();

    // TODO: determine if this is necessary or put into child
    // this.socket.on('update', (data) => {
    //   console.log('update: ' + data);
    //   // TODO: implement joinRoom socket logic in server-side to handle stage change
    // });

    // TODO: decide if this should happen in parent, or child components
    // Putting this in the child component
    // this.socket.emit('joinServer', this.state.roomcode);

    // TODO: determine if this is necessary or put into child
    // this.socket.on('retrospectiveStageUpdate', (retrospectiveId) => {
    //   // Fetch new retrospective data when retrospective socket event received
    //   RetrospectiveActions.getRetrospective(retrospectiveId);
    // });
  }

  componentWillUnmount() {
    RetrospectiveStore.unlisten(this.onChange);
  }

  componentDidUpdate() {
    // TODO: determine if this is necessary or put into child
    // if(this.state.isRetroReady) {
    //   console.log('client: updateStage1');
    //   // this.socket.emit('updateStage', this.state.stage);
    // }
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();
    var username;

    if(!this.state.username) {
      RetrospectiveActions.invalidUsername();
      this.refs.usernameTextField.focus();
    } else {
      username = this.state.username;
    }

    if(username) {
      RetrospectiveActions.startRetrospective(clone(this.state));
    }
  }

  /*
   * Callback method for the landing template form Join Retro.
   */
  handleLandingJoinRetro(state) {
    if(!state.joinRetroError){
      this.setState({ showModal: state.showModal });

      let route = '/' + state.roomCode;
      this.props.history.push(route);
    }
  }

  /*
   * Callback method for the landing create retro form.
   */

  handleCreateRetro(state) {
    if(state.isRetroSuccess && !state.roomCodeValidationState){
      this.setState({
        showModal: state.isRetroSuccess,
        title: state.title,
        roomCode: state.roomCode,
        sprintTimer: state.sprintTimer,
        sprintNumber: state.sprintNumber
      });

      let route = '/' + state.roomCode + '/admin';
      this.props.history.push(route);
    }
  }

  handleRetroStarted(state){
    if(state.retroStarted && !state.isAdmin) {
      //do all process here when retro started.
      this.setState({ showModal: false });
      //RetrospectiveActions.getRetrospective(state.roomCode);
      RetrospectiveActions.getRetrospective(this.props.routeParams.roomcode);
    }
  }

  handleOnSaveClose(state){
    let route = '/';
    this.state.resetCreateForm = true;
    this.props.history.push(route);
  }

  //Will show the landing page component render template; should be on first load of page.
  showLandingPage() {
    return(
      <div>
        <RetrospectiveLanding onJoinRetro={this.handleLandingJoinRetro} />
      </div>
    );
  }

  //Will show the retrospective create form component render template.
  showCreateRetrospectivePage() {
    return(
      <div>
        <RetrospectiveCreate onCreateRetro={this.handleCreateRetro}
            onReset={this.state.resetCreateForm}
            socket={this.socket}
            onJoinRetro={this.handleLandingJoinRetro} />
      </div>
    );
  }

  //Will show the retrospective share thoughts/category listing component render template.
  showShareThoughtsPage() {
    return(
      <div>
        <RetrospectiveCategoryList
          usertype={this.props.params.usertype}
          roomcode={this.props.params.roomcode}
          showModal={this.state.showModal}
          socket={this.socket}
          retrospective={this.state}
          onRetroStarted={ this.handleRetroStarted }
          onSaveClose={ this.handleOnSaveClose } />
      </div>
    );
  }

  //Will show the summary component render template.
  showSummaryPage() {
    return(
      <div>
        <RetrospectiveSummary
          retrospective={this.state} />
      </div>
    );
  }

  //Component rendering template process.
  renderRetrospectiveComponent() {
    let retro_component = null;
    let params_roomcode = this.props.params.roomcode;
    let params_usertype = this.props.params.usertype;

    if(params_roomcode && params_roomcode != 'create' && params_usertype != 'summary') {
      retro_component = this.showShareThoughtsPage();
    } else if(params_roomcode == 'create') {
      retro_component = this.showCreateRetrospectivePage();
    } else if(params_usertype == 'summary') {
      // TODO: refactor to include summary in SPA, via statecode (URL params)
      retro_component = this.showSummaryPage();
    } else {
      retro_component = this.showLandingPage();
    }

    return(
      <div>
        {retro_component}
      </div>
    );
  }

  render() {
    return(
      <div>
        {this.renderRetrospectiveComponent()}
      </div>
    );
  }
}

export default Retrospective;
