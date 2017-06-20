import alt from '../alt';
import RetrospectiveCategoryListAction from '../actions/RetrospectiveCategoryListAction';
import RetrospectiveSource from '../sources/RetrospectiveCategorySources';

class RetrospectiveCategoryListStore {
  constructor(){
    this.retrospective = {
      _id: 4657744,
      title: String,
      categories: {
          type: Array,
          default: ["What went well?",
              "What didn't go well?",
              "What did we learn?",
              "What still puzzles us?"]
      },
      isVotable: { type: Boolean, default: false },
      isTimeboxed: { type: Boolean, default: false },
      displayThoughtPreference: { type: "String", default: "personal"},
      stage: { type: "String", default: "initial" },
      userId: { type: "String", default: "" }
    };
    this.errorMessage = null;

    this.bindListeners({
      handleUpdateRetrospectives: RetrospectiveCategoryListAction.updateRetrospectives,
      handleFetchRetrospectives: RetrospectiveCategoryListAction.fetchRetrospective,
      handleRetrospectivesFailed: RetrospectiveCategoryListAction.retrospectiveFailed
    });
  }

  handleUpdateRetrospectives(retrospectives){
    this.retrospective = retrospectives;
    this.errorMessage = null;
  }

  handleFetchRetrospectives(){
    this.retrospective = [];
  }

  handleRetrospectivesFailed(errorMessage){
    this.errorMessage = errorMessage;
  }

  getRetrospective(id){
    let { retrospective } = this.getState();

    return retrospective;
  }
}

export default alt.createStore(RetrospectiveCategoryListStore);
