import alt from '../alt';
import RetrospectiveManageActions from '../actions/RetrospectiveManageActions';
import {assign, contains} from 'underscore';

class RetrospectiveManageStore {
  constructor() {
    this.bindActions(RetrospectiveManageActions);
    this.retrospectiveId = 0;
    this.title = '';
    this.sprintNumber = '';
    this.sprintTimer = '';
    this.isVotable = false;
    this.isTimeboxed = false;
    this.displayThoughtPreference = 'personal';
    this.stage = 'initial';
    this.groups = [];
    this.thoughts = [];
    this.roomCode = '';

    this.helpBlock = '';

    this.titleValidationState = '';
    this.isVotableValidationState = '';
  }

  onGetRetrospectiveSuccess(data) {
    assign(this, data);
    console.log(data);
    this.retrospectiveId = data._id;
  }

  onGetRetrospectiveFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onUpdateRetrospectiveSuccess(successMessage) {
    this.titleValidationState = 'has-success';
    this.helpBlock = successMessage;
  }

  onUpdateRetrospectiveFail(errorMessage) {
    this.titleValidationState = 'has-error';
    this.helpBlock = errorMessage;
  }

  onDeleteRetrospectiveSuccess(data) {
    toastr.success(data.message);
    this.retrospectiveId = -1;
  }

  onDeleteRetrospectiveFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onUpdateTitle(event) {
    this.title = event.target.value;
    this.titleValidationState = '';
    this.helpBlock = '';
  }

  onUpdateStage(event) {
    this.stage = event.target.value;
    this.stageValidationState = '';
    this.helpBlock = '';
  }

  onUpdateDisplayThoughtPreference(event) {
    this.displayThoughtPreference = event.target.value;
    this.displayThoughtPreferenceValidationState = '';
    this.helpBlock = '';
  }

  onUpdateIsVotable(event) {
    this.isVotable = event.target.value == 'true' ? true : false;
    this.isVotableValidationState = '';
  }

  onUpdateIsTimeboxed(event) {
    this.isTimeboxed = event.target.value == 'true' ? true : false;
    this.isTimeboxedValidationState = '';
  }

  onUpdateSprintNumber(event) {
    this.sprintNumber = event.target.value;
    this.sprintNumberValidationState = '';
    this.helpBlock = '';
  }

  onUpdateSprintTimer(event) {
    this.sprintTimer = event.target.value;
    this.sprintTimerValidationState = '';
    this.helpBlock = '';
  }

  onUpdateRoomCode(event) {
    this.roomCode = event.target.value;
    this.roomCodeValidationState = '';
  }

  onInvalidTitle() {
    this.titleValidationState = 'has-error';
    this.helpBlock = 'Please enter a retrospective title.';
  }

  onInvalidIsVotable() {
    this.isVotableValidationState = 'has-error';
  }

  onInvalidIsTimeboxed() {
    this.isTimeboxedValidationState = 'has-error';
  }
}

export default alt.createStore(RetrospectiveManageStore);
