import alt from '../alt';
import RetrospectiveListActions from '../actions/RetrospectiveListActions';

class RetrospectiveListStore {
  constructor() {
    this.bindActions(RetrospectiveListActions);
    this.retrospectives = [];
  }

  onGetRetrospectivesSuccess(data) {
    this.retrospectives = data;
  }

  onGetRetrospectivesFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(RetrospectiveListStore);
