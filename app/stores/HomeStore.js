import alt from '../alt';
import HomeActions from '../actions/HomeActions';

class HomeStore {
  constructor() {
    this.bindActions(HomeActions);
    this.retrospectives = [];
  }

  onGetRetrospectivesSuccess(data) {
    this.retrospectives = data;
  }

  onGetRetrospectivesFail(errorMessage) {
    toastr.error(errorMessage);
  }

  onVoteFail(errorMessage) {
    toastr.error(errorMessage);
  }
}

export default alt.createStore(HomeStore);
