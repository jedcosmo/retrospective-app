import alt from '../alt';

class RetrospectiveCategoryListAction{

  updateRetrospectives(retrospectives){
    console.log('retrospectives ', retrospectives);
    this.dispatch(retrospectives);
  }

  fetchRetrospective(){
    this.dispatch();
  }

  retrospectiveFailed(retrospectives){
    this.dispatch(retrospectives);
  }
}

export default alt.createActions(RetrospectiveCategoryListAction);
