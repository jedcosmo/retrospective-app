import React from 'react';
import AuthService from '../../../utils/AuthService';
import RetrospectiveCreateStore from '../../stores/RetrospectiveCreateStore';
import RetrospectiveCreateActions from '../../actions/RetrospectiveCreateActions';
import {clone} from 'underscore';
import Footer from '../global/Footer';
import Navbar from '../global/Navbar';
import WindowModal from '../global/WindowModal';

class RetrospectiveCreate extends React.Component {
  constructor(props) {
    super(props);

    this.state = RetrospectiveCreateStore.getState();
    this.onChange = this.onChange.bind(this);
    this.handleJoinModal = this.handleJoinModal.bind(this);
    this.handleJoinSubmitCode = this.handleJoinSubmitCode.bind(this);
    this.handleJoinCode = this.handleJoinCode.bind(this);
    this.handleJoinLinkBackToCreate = this.handleJoinLinkBackToCreate.bind(this);

    this.state.showModal = false;
  }

  componentDidMount() {
    RetrospectiveCreateStore.listen(this.onChange);
  }

  componentWillUnmount() {
    RetrospectiveCreateStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);

    //this will trigger the modal to show for joining from create form.
    if(state.isJoinRoomClick) {
      this.state.showModal = true;
    }

    if(state.isRetroCreateSubmitted) {
      //return in callback the current state for the successful/failed retro creation.
      this.props.onCreateRetro( this.state );
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    // note: add regex to roomCode
    var roomCode;
    var title;
    var sprintNumber = this.state.sprintNumber;
    var sprintTimer = this.state.sprintTimer;

    if(!this.state.roomCode) {
      RetrospectiveCreateActions.invalidRoomCode();
      this.refs.roomCodeTextField.focus();
    } else {
      roomCode = this.state.roomCode.trim();
    }

    if(!this.state.title) {
      RetrospectiveCreateActions.invalidTitle();
      this.refs.titleTextField.focus();
    } else {
      title = this.state.title.trim();
    }

    if(roomCode && title) {
      RetrospectiveCreateActions.createRetrospective(clone(this.state));
    }
  }

  handleJoinModal(e) {
    RetrospectiveCreateActions.openJoinModal(true);
    e.preventDefault();
  }

  handleJoinCode(state) {
    //use this if still need to do something with the value of room code.
  }

  handleJoinSubmitCode(state) {
    this.props.onJoinRetro(state);
  }

  handleJoinLinkBackToCreate(state){
    this.setState(state);
  }

  showModalJoinRoomCode() {
    if(this.state.showModal) {
      return(
        <div>
          <WindowModal
            socket={ this.props.socket }
            initialJoinSubmitted={ false }
            initialJoinRoomCode={ false }
            initialShowModal={ this.state.showModal }
            isAdmin={ false }
            isAdminJoinCode={ true }
            onChangeCode={ this.handleJoinCode }
            onSubmitCode={ this.handleJoinSubmitCode }
            onBackToCreate={ this.handleJoinLinkBackToCreate }/>
        </div>
      );
    }else{
      return(<div></div>);
    }
  }

  showRetrospective(){
    //reset the form fields when onSaveClose from share thoughts components.
    if( this.props.onReset ) {
      this.state.title = '';
      this.state.sprintNumber = '';
      this.state.sprintTimer = 3;
    }

    return (
      <div className="container stage-create">
        <div className="component-box">
          <div className="component-box-retro-info">
            <h1>CREATE RETRO</h1>
            <div className="component-inner-box-retro-info">
              <form onSubmit={this.handleSubmit.bind(this)}>
                <div className="field-container">
                  <div className={'field form-group ' + this.state.roomCodeValidationState}>
                    <label>Room Code</label>
                    <input type="text" className="form-control" value={this.state.roomCode} ref="roomCodeTextField" onChange={RetrospectiveCreateActions.updateRoomCode} autoFocus />
                    <span className="help-block">{this.state.helpBlockRoomCode}</span>
                  </div>

                    <div className={'field form-group ' + this.state.titleValidationState}>
                      <label>Project Name</label>
                      <input type="text" className="form-control" value={this.state.title} ref="titleTextField" onChange={RetrospectiveCreateActions.updateTitle} />
                      <span className="help-block">{this.state.helpBlockTitle}</span>
                    </div>

                    <div className="field field-optional">
                      <label>Sprint <span className="explaination">(optional)</span></label>
                      <input type="text" className="form-control" value={this.state.sprintNumber} ref="titleTextField" onChange={RetrospectiveCreateActions.updateSprintNumber} />
                    </div>

                    <div className="field field-optional">
                      <label>Timer <span className="explaination">(minutes)</span></label>
                      <i className="fa fa-caret-down" aria-hidden="true"></i>
                      <select className="form-control" value={this.state.sprintTimer}
                              onChange={RetrospectiveCreateActions.updateSprintTimer}>
                        <option value=""></option>
                        <option value="3">3 Minutes</option>
                        <option value="4">4 Minutes</option>
                        <option value="5">5 Minutes</option>
                        <option value="6">6 Minutes</option>
                        <option value="7">7 Minutes</option>
                        <option value="8">8 Minutes</option>
                        <option value="9">9 Minutes</option>
                        <option value="10">10 Minutes</option>
                        <option value="11">11 Minutes</option>
                        <option value="12">12 Minutes</option>
                      </select>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">CREATE ROOM</button>
              </form>
              <p className="bottomLink">Already created a room? <a href="#" onClick={this.handleJoinModal}>Join a Room</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return(
      <div>
        <Navbar />
        {this.showRetrospective.bind(this)()}
        {this.showModalJoinRoomCode()}
        <Footer />
      </div>
    );
  }
}

export default RetrospectiveCreate;
