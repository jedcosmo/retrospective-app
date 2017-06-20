/*
 * @developer: jerome.dymosco@domandtom.com
 * @date: April 27, 2014
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';
import RetrospectiveStore from '../../stores/RetrospectiveStore';
import RetrospectiveActions from '../../actions/RetrospectiveActions';
import {map} from 'underscore';

class WindowModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = RetrospectiveStore.getState();
    this.onChange = this.onChange.bind(this);

    this.state.joinRoomCode = this.props.initialJoinRoomCode;
    this.state.joinName = this.props.initialJoinName;
    this.state.joinSubmitted = this.props.initialJoinSubmitted;
    this.state.showModal = this.props.initialShowModal;
    this.state.modalSize = 'large';
    this.state.retroStarted = false;
    this.state.retroState = this.props.retroState;
    this.state.loading = true;
    
    this.onJoinNameChanged = this.onJoinNameChanged.bind(this);
    this.onJoinSubmit = this.onJoinSubmit.bind(this);
    this.onSaveClose = this.onSaveClose.bind(this);
    this.onCloseNoSaving = this.onCloseNoSaving.bind(this);
    this.onStartSubmit = this.onStartSubmit.bind(this);
    this.onJoinCodeChanged = this.onJoinCodeChanged.bind(this);
    this.onJoinCodeSubmit = this.onJoinCodeSubmit.bind(this);
    this.onBackToCreateForm = this.onBackToCreateForm.bind(this); 
    
    this.copyToClipboard = this.copyToClipboard.bind(this);
  }

  componentDidMount() {
    RetrospectiveStore.listen(this.onChange);      
  }

  componentWillUnmount() {
    RetrospectiveStore.unlisten(this.onChange);
  }
  
  onChange(state) {
    this.setState(state);

    /* Do the state process of submitting modal join form room code here */
    if(this.state.modalRetroNotFound) {
      this.setState({ joinRetroError: 'Retrospective with room code (' + this.state.joinRoomCode + ') not found.' });
      this.props.onSubmitCode({ showModal: true, joinRetroError: 'Retrospective with room code (' + this.state.joinRoomCode + ') not found.' });
    }

    if(!this.state.modalRetroNotFound && this.state.doModalRetroJoinRoomCode) {
      this.props.onSubmitCode({ roomCode: this.state.joinRoomCode, showModal: true, joinRetroError: false });
    }
    //end of modal for join room code.
  }

  onJoinNameChanged(e) {
    const newState = e.target.value;
    this.setState({ joinName: newState }); // we update our state
    this.props.onChange(newState); // we notify our parent
  }

  onJoinSubmit(e) {    
    let doShowModal = true;
    
    if( !this.state.joinName.trim() ) {
      this.setState({ joinRetroError: 'You should provide your name before joining a room.' });
      this.props.onSubmit({ joinSubmitted: true, showModal: doShowModal, joinName: this.state.joinName, joinRetroError: 'You should provide your name before joining a room.' });
    } else {
      
      if(this.props.retroState.stage != 'setup'){
        doShowModal = false;
      }
                  
      this.setState({ joinSubmitted: true, showModal: doShowModal, joinRetroError: false, modalSize: 'sm' });
      this.props.onSubmit({ joinSubmitted: true, showModal: doShowModal, joinRetroError: false, joinName: this.state.joinName });
    }

    e.preventDefault();
  }

  onJoinCodeChanged(e) {
    let newState = e.target.value;
    this.setState({ joinRoomCode: newState });
    this.props.onChangeCode(newState);
  }

  onJoinCodeSubmit(e) {   
   if( !this.state.joinRoomCode ) {
      this.setState({ joinRetroError: 'You should provide room code before joining a room.' });
      this.props.onSubmitCode({ joinSubmitted: false, showModal: true, joinRetroError: 'You should provide room code before joining a room.' });
    } else {
      //let's check first if the room code existed.
      RetrospectiveActions.getRetrospective(this.state.joinRoomCode);
    }

    e.preventDefault();
  }

  onBackToCreateForm(e){
    this.props.onBackToCreate({ showModal: false });
    e.preventDefault();
  }

  onStartSubmit(e) {
    e.preventDefault();
    this.setState({ retroStarted: true, showModal: false });
    this.props.onStartRetro({ retroStarted: true, showModal: false });
  }

  onSaveClose(e) {
    this.setState({ showModal: false });
    this.props.onSaveClose({ doSaveClose: true });
    e.preventDefault();
  }

  onCloseNoSaving(e) {
    this.setState({ showModal: false });
    this.props.onCloseNoSaving({ doCloseNoSaving: true });
    e.preventDefault();
  }
  
  copyToClipboard(e){     
    var id = $(e.target).attr('id');
    console.log(id);
    e.preventDefault();
  }

  showAdminExtendedModal(noteClass, noteMessage){
    return(
      <div>
        <div className='modal-column join'>
          <div className='modal-box-join-container'>
            <div className="modal-box-join">
              <h3 className='modal-header-join'>Join Retro</h3>

              <div className='modal-join-details'>
                <div className='modal-join-room-code'>
                  <div className='room-code-label'>ROOM CODE</div>
                  <div className='room-code' onClick={this.copyToClipboard} id={'clipboardRoomCode'}>{this.state.retroState.roomCode}</div>
                </div>

                <div className='modal-join-details-border'></div>

                <div className='modal-join-retro-edit'>
                  <div className='retro-label'>PROJECT NAME:</div>
                  <div className='retro-value'>{this.state.retroState.title}</div>

                  <div className='project-values'>
                    <div className='retro-sprint'>
                      <div className='retro-label'>SPRINT NUMBER:</div>
                      <div className='retro-value'>{this.state.retroState.sprintNumber}</div>
                    </div>
                    <div className='retro-timmer'>
                      <div className='retro-label'>TIMER:</div>
                      <div className='retro-value'>{this.state.retroState.sprintTimer} Minutes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='buttons-retro'>
              <button type='submit' className="save-close-retro" onClick={this.onSaveClose}>SAVE & Close</button>
              <button type='button'className='close-without-saving' onClick={this.onCloseNoSaving}>or close without saving</button>
            </div>
          </div>
        </div>
        <div className='modal-column introduce'>
          <h2>The Prime Directive</h2>
          <div className='underline'></div>
          <p>
            Regardless of what we discover, we understand and truly believe that everyone did the best job they could, given
            what they knew at the time, their skills and abilities, the resources, and the situation at hand.
          </p>
          <p>
            At the end of a project everyone knows so much more. Naturally we will discover decisions and actions we wish we could do over.
            This is wisdom to be celebrated, not judgement used to embarass.
          </p>

          <form className='modal-box-introduce-form' onSubmit={this.onJoinSubmit} >
            <div className="modal-box-introduce">
              <h3 className='modal-header-introduce'>Introduce Yourself</h3>
                <div className="modal-box-introduce-inner">
                  <input type="text" placeholder="Your name" onChange={this.onJoinNameChanged} autoFocus />
                  <span className={ 'note ' + noteClass }>{ noteMessage }</span>
                </div>
            </div>
            <div className='buttons-introduce'>
              <button type="submit" className="join-retro-btn">Join Retro</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  showUserModal(noteClass, noteMessage) {
    return(
        <div className="attendee-intro">
          <h2>The Prime Directive</h2>
          <div className="underline"></div>
          <p>
            Regardless of what we discover, we understand and truly believe that everyone did the best job they could, given
            what they knew at the time, their skills and abilities, the resources, and the situation at hand.
          </p>
          <p>
            At the end of a project everyone knows so much more. Naturally we will discover decisions and actions we wish we could do over.
            This is wisdom to be celebrated, not judgement used to embarass.
          </p>

          <form className='modal-box-introduce-form' onSubmit={this.onJoinSubmit} >
            <div className="modal-box-introduce">
              <h3 className='modal-header-introduce'>Introduce Yourself</h3>
                <div className="modal-box-introduce-inner">
                  <input type="text" placeholder="Enter your first name here" onChange={this.onJoinNameChanged} autoFocus />
                  <span className={ 'note ' + noteClass }>{ noteMessage }</span>
                </div>
            </div>
            <div className="col-md-12">
              <button type="submit" className="join-retro-btn">Join Retro</button>
            </div>
            <div className="col-md-12">
                <a className="link" href="/">running the retro? <span className="click-me">Click here.</span></a>
            </div>
          </form>
        </div>
      );
  }

  showLoading() {

    if(this.state.loading){
      return(
        <img src="/img/loading.gif" alt=""/>
      );
    }
  }

  showModalSubmittedContent() {
    var members = this.state.joinedUsers.length > 0 ? this.state.joinedUsers : this.state.retroState.joinedUsers;
    var admin_icon = null;
    
    var joinedMembers = map(members, (member) => {
      
      if(member == this.state.joinName) {
        admin_icon = <i>A</i>;
      }else{
        admin_icon = null;
      } 
      
      return(
        <div className="col-md-4 members-name">
          {member} {admin_icon}
        </div>
      );
    });


    if(this.props.isAdmin) {
      return(
        <div className="attendees-wrapper">
          <h2 className="attendees-title">Join Retro</h2>
          <form className='modal-attendees-start-form' onSubmit={this.onStartSubmit} >
            <div className="modal-attendees-start">
              <h3 className='modal-header-attendees-start'>
                <svg width="35" height="35" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M529 896q-162 5-265 128h-134q-82 0-138-40.5t-56-118.5q0-353 124-353 6 0 43.5 21t97.5 42.5 119 21.5q67 0 133-23-5 37-5 66 0 139 81 256zm1071 637q0 120-73 189.5t-194 69.5h-874q-121 0-194-69.5t-73-189.5q0-53 3.5-103.5t14-109 26.5-108.5 43-97.5 62-81 85.5-53.5 111.5-20q10 0 43 21.5t73 48 107 48 135 21.5 135-21.5 107-48 73-48 43-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-1024-1277q0 106-75 181t-181 75-181-75-75-181 75-181 181-75 181 75 75 181zm704 384q0 159-112.5 271.5t-271.5 112.5-271.5-112.5-112.5-271.5 112.5-271.5 271.5-112.5 271.5 112.5 112.5 271.5zm576 225q0 78-56 118.5t-138 40.5h-134q-103-123-265-128 81-117 81-256 0-29-5-66 66 23 133 23 59 0 119-21.5t97.5-42.5 43.5-21q124 0 124 353zm-128-609q0 106-75 181t-181 75-181-75-75-181 75-181 181-75 181 75 75 181z"/></svg>
                <span className='modal-header-ctr-attendees'>
                  {members.length} { (members.length > 1) ? 'Attendees' : 'Attendee' }
                </span>
              </h3>
              <div className="modal-attendees-start-inner">
                <div className="row">
                  {joinedMembers}
                </div>
              </div>
            </div>
              <hr className="retro-break-point"/>
            <button type="submit" className="start-retro-btn">Start Retro</button>
          </form>
        </div>
      );
    } else {       
      return(
        <div className="waiting-modal">
          <h2>Just a minute...</h2>
          {this.showLoading()}              
          <p>Your Team is still joining.</p>
          <p>The retrospective will begin momentarily</p>
        </div>
      );
    }
  }

  showModalJoinRetroRoomCode(noteClass, noteMessage) {
    return(
        <div>
          <h2>The Prime Directive</h2>
          <p>
            Regardless of what we discover, we understand and truly believe that everyone did the best job they could, given
            what they knew at the time, their skills and abilities, the resources, and the situation at hand.
          </p>
          <p>
            At the end of a project everyone knows so much more. Naturally we will discover decisions and actions we wish we could do over.
            This is wisdom to be celebrated, not judgement used to embarass.
          </p>

          <form className='modal-box-introduce-form' onSubmit={this.onJoinCodeSubmit} >
            <div className="modal-box-introduce">
              <h3 className='modal-header-introduce'>JOIN</h3>
                <div className="modal-box-introduce-inner">
                  <input type="text" placeholder="Enter room code here" onChange={this.onJoinCodeChanged} autoFocus />
                  <span className={ 'note ' + noteClass }>{ noteMessage }</span>
                </div>
            </div>
            <button type="submit" className="join-retro-btn">Join Retro</button>
            <a href="#" onClick={this.onBackToCreateForm} className="back-btn">Back to create form</a>
          </form>
        </div>
      );
  }

  showModalContent() {
    let noteMessage = null;
    let noteClass = null;
    let modalContent = null;
    
    //don't show any modal when retrospective stage was already started.
    if(this.state.stage != 'setup' && this.state.joinSubmitted){      
      this.state.showModal = false;
    }
    
    if( !this.state.joinRetroError ) {
      noteClass = 'no-error';
      noteMessage = '';
    } else {
      noteClass = 'has-error';
      noteMessage = this.state.joinRetroError;
    }    

    if(this.props.isAdmin) {
      modalContent = this.showAdminExtendedModal(noteClass, noteMessage);
    }else if(this.props.isAdminJoinCode){
      modalContent = this.showModalJoinRetroRoomCode(noteClass, noteMessage);
    } else {
      modalContent = this.showUserModal(noteClass, noteMessage);
    }

    if( this.state.joinSubmitted && !this.state.joinRetroError ) {
      return(
        <div>
          {this.showModalSubmittedContent()}
        </div>
      );
    } else {
      return(
        <div>
          { modalContent }
        </div>
      );
    }
  }

  render() {
    let modalClassAdmin = '';

    if(this.props.isAdmin) {
      modalClassAdmin = 'is-admin';
    }

    return(
      <div className='modal-join-introduce'>
        <Modal bsSize={this.state.modalSize} dialogClassName={modalClassAdmin} show={this.state.showModal} >
          <Modal.Body>
            { this.showModalContent() }
          </Modal.Body>
        </Modal>
      </div>
    );
  }

}

export default WindowModal;
