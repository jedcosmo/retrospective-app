import alt from '../alt';
import RetrospectiveActions from '../actions/RetrospectiveActions';
import {assign, contains} from 'underscore';

class RetrospectiveStore {
  constructor() {
    this.bindActions(RetrospectiveActions);
    this.username = '';
    this.count = 0;
    this.helpBlock = '';
    this.usernameValidationState = '';
    this.isRetroReady = false;
    this.roomCode = '';
    this.id = '';
    this.sprintNumber = '';
    this.sprintTimer = 3;
    this.categories = ["What went well?",
                        "What didn't go well?",
                        "What did we learn?",
                        "What still puzzles us?",
                        ];
    this.isVotable = false;
    this.isTimeboxed = false;
    this.displayThoughtPreference = "personal";
    this.stage = "setup";
    this.thoughts = [];
    this.groups = [];
    this.userId = '';
    this.joinedUsers = [];
    this.modalRetroNotFound = false;
    this.doModalRetroJoinRoomCode = false;
    this.getRetrospectiveFailed = false;

    // states affecting both thoughts and retro
    this.votesCasted = 0;
    this.votesAllowed = 3;
    this.votesMax = 3;
    this.voteStatus = 0;
    this.usersFinishedVote = [];


    //start of thoughts only
    this.thoughts._id = 0;
    this.thoughts.categoryId = 0;
    this.thoughts.groups = [];
    this.thoughts.retrospectiveId = 0;
    this.thoughts.text = 'Write a thought';
    this.thoughts.userId = '';
    this.thoughts.votes = [];
    this.thoughts.isHidden = false;



  }

  onGetRetrospectiveSuccess(data) {
    assign(this, data);
    /*this.count = data.joinedUsers.length;
    this.stage = data.stage;*/
    this.modalRetroNotFound = false;
    this.doModalRetroJoinRoomCode = true;
  }

  onGetRetrospectiveFail(jqXhr) {
    this.modalRetroNotFound = true;
    this.getRetrospectiveFailed = true;
    console.log(jqXhr.responseJSON.message); //console.log instead of broadcasting the error message via toastr
  }

  onStartRetrospectiveSuccess(successMessage) {
    this.isRetroReady = true;
  }

  onStartRetrospectiveFail(errorMessage) {
    this.usernameValidationState = 'has-error';
    this.helpBlock = errorMessage;
  }

  onUpdateUsername(event) {
    this.username = event.target.value;
    this.usernameValidationState = '';
    this.helpBlock = '';
  }

  onJoinRetrospectiveSuccess(data) {
    this.helpBlock = data.message;
    localStorage.setItem("username", data.username);
  }

  onJoinRetrospectiveFail(errorMessage) {
    this.usernameValidationState = 'has-error';
    this.helpBlock = errorMessage;
  }

  onVoteFinishedUserSuccess(data) {
    console.log(data);
    this.usersFinishedVote = data.usersFinishedVote;
  }

  onVoteFinishedUserFail(data) {

  }

  onUpdateRetrospectiveSuccess(data) {
    this.stage = data.retrospective.stage;
    this.displayThoughtPreference = data.retrospective.displayThoughtPreference;
  }

  onInvalidUsername() {
    this.usernameCodeValidationState = 'has-error';
    this.helpBlock = 'Please enter a valid username.';
  }


  //Start Thought Store

  onGetAllThoughtsSuccess(data) {
    assign(this.thoughts, data);
  }

  onGetAllThoughtsFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onGetThoughtSuccess(data) {
    this.thoughts = data;
  }

  onGetThoughtFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onCreateThoughtSuccess(data) {
    this.thoughts = data;
    //assign(this.thoughts, data);
  }

  onUpdateThoughtSuccess(data) {
    this.thoughts = data.retrospective.thoughts;
  }

  onUpdateThoughtFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onDeleteThoughtSuccess(data) {
    this.thoughts = data.thoughts;
    //assign(this.thoughts, data);
    //console.log(data);
    //toastr.info('Thought has been deleted.');
  }
  onDeleteThoughtFail(data) {
    toastr.info('Thought deletion failed.');
  }

  onVoteSuccess(data) {
    this.thoughts = data.retrospective.thoughts;
  }

  onGroupThoughtSuccess(data) {
    //console.log(data);
    //assign(this.thoughts, data);
  }

  onGroupThoughtFail() {

  }

  onUnGroupThoughtSuccess(data) {
    console.log(data);
  }
}

export default alt.createStore(RetrospectiveStore);
