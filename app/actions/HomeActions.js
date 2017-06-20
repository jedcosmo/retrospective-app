import alt from '../alt';

class HomeActions {
  constructor() {
    this.generateActions(
      'getRetrospectivesSuccess',
      'getRetrospectivesFail',
      'voteFail'
    );
  }

  getRetrospectives() {
    $.ajax({ url: '/api/retrospectives' })
      .done(data => {
        this.actions.getRetrospectivesSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.getRetrospectivesFail(jqXhr.responseJSON.message);
      });
  }

  // to be redefined
  vote(winner, loser) {
    $.ajax({
      type: 'PUT',
      url: '/api/retrospectives' ,
      data: { winner: winner, loser: loser }
    })
      .done(() => {
        this.actions.getRetrospectives();
      })
      .fail((jqXhr) => {
        this.actions.voteFail(jqXhr.responseJSON.message);
      });
  }
}

export default alt.createActions(HomeActions);
