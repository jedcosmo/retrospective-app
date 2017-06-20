import alt from '../alt';
import RetrospectiveLandingActions from '../actions/RetrospectiveLandingActions';

class RetrospectiveLandingStore {
  constructor() {
    this.bindActions(RetrospectiveLandingStore);
  }
}

export default alt.createStore(RetrospectiveLandingStore);
