import alt from '../alt';
import ThoughtActions from '../actions/ThoughtActions';
import {assign, contains} from 'underscore';

class ThoughtStore {
  constructor() {
    this.bindActions(ThoughtActions);
    this._id = 0;
    this.categoryId = 0;
    this.groups = [];
    this.retrospectiveId = 0;
    this.text = 'Write a thought';
    this.userId = 333333;
    this.votes = [];

    this.thoughts = [];

  }

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
    //this.text = data.thought.text;
  }

  onUpdateThoughtFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onDeleteThoughtSuccess(data) {
    this.thoughts = data;
    //assign(this.thoughts, data);
    //console.log(data);
    //toastr.info('Thought has been deleted.');
  }
  onDeleteThoughtFail(data) {
    toastr.info('Thought deletion failed.');
  }

  onVoteSuccess(data) {

  }

  onGroupThoughtSuccess(data) {
    console.log(data);
    //assign(this.thoughts, data);
  }

  onGroupThoughtFail() {
    
  }
}

export default alt.createStore(ThoughtStore);
