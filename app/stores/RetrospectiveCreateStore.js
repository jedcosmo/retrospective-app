import alt from '../alt';
import RetrospectiveCreateActions from '../actions/RetrospectiveCreateActions';

class RetrospectiveCreateStore {
  constructor() {
    var crypto = require('crypto');
    let crypto_len = 6;
    
    this.bindActions(RetrospectiveCreateActions);
    this.roomCode = crypto.randomBytes(Math.ceil(crypto_len/2)).toString('hex').slice(0,crypto_len);                
    this.title = '';
    this.sprintNumber = '';
    this.sprintTimer = 3;
    
    this.helpBlockRoomCode = '';
    this.helpBlockTitle = '';

    this.roomCodeValidationState = '';
    this.titleValidationState = '';
    this.sprintNumberValidationState = '';
    this.sprintTimerValidationState = '';

    this.isRetroSuccess = false;
    this.isRetroCreateSubmitted = false;
    this.isJoinRoomClick = false;
  }

  onCreateRetrospectiveSuccess(successMessage) {
    this.isRetroSuccess = true;
    this.isRetroCreateSubmitted = true;
  }

  onCreateRetrospectiveFail(errorMessage) {
    this.roomCodeValidationState = 'has-error';
    this.helpBlockRoomCode = errorMessage;
    this.isRetroCreateSubmitted = true;
  }

  onUpdateRoomCode(event) {
    this.roomCode = event.target.value; 
    this.roomCodeValidationState = '';
    this.helpBlockRoomCode = ''
  }

  onUpdateTitle(event) {
    this.title = event.target.value;
    this.titleValidationState = '';
    this.helpBlockTitle = '';
  }

  onUpdateSprintNumber(event) {
    this.sprintNumber = event.target.value;
    this.sprintNumberValidationState = '';
  }

  onUpdateSprintTimer(event) {
    this.sprintTimer = event.target.value;
    this.sprintTimerValidationState = '';
  }

  onInvalidRoomCode() {
    this.roomCodeValidationState = 'has-error';
    this.helpBlockRoomCode = 'Please enter a room code.';
  }

  onInvalidTitle() {
    this.titleValidationState = 'has-error';
    this.helpBlockTitle = 'Please enter a retrospective title.';
  }
  
  onOpenRetrospectiveJoinModal(data){
    this.isJoinRoomClick = data;
  }
}

export default alt.createStore(RetrospectiveCreateStore);
