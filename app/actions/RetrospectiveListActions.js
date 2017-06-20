import alt from '../alt';

class RetrospectiveListActions {
  constructor() {
    this.generateActions(
      'getRetrospectivesSuccess',
      'getRetrospectivesFail'
    );
  }

  getRetrospectives(payload) {
    let url = '/api/retrospectives/recent';

    // params.isTimeboxed = payload.category;

    // if (payload.unarchived === 'unarchived') {
    //   url = '/api/retrospectives/unarchived';
    // }

    $.ajax({ url: url, data: params })
      .done((data) => {
        this.actions.getRetrospectivesSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getRetrospectivesFail(jqXhr);
      });
  }
}

export default alt.createActions(RetrospectiveListActions);
