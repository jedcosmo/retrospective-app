import alt from '../alt';
import RetrospectiveSummaryActions from '../actions/RetrospectiveSummaryActions';
import {assign, contains} from 'underscore';

class RetrospectiveSummaryStore {
  constructor() {
    this.bindActions(RetrospectiveSummaryActions);
  }

  onGetRetrospectiveSuccess(data) {
    assign(this, data);
    let localData = localStorage.getItem('retro-app') ? JSON.parse(localStorage.getItem('retro-app')) : {};
    let archives = localData.archives || [];
  }

  onGetRetrospectiveFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onArchiveSuccess() {
    let localData = localStorage.getItem('retro-app') ? JSON.parse(localStorage.getItem('retro-app')) : {};
    localData.archives = localData.archives || [];
    localData.archives.push(this.id);
    localStorage.setItem('retro-app', JSON.stringify(localData));
    toastr.info('Retrospective has been archived.');
  }

  onArchiveFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

}

export default alt.createStore(RetrospectiveSummaryStore);
