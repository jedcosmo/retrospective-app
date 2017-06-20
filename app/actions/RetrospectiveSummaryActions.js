import alt from '../alt';

class RetrospectiveSummaryActions {
  constructor() {
    this.generateActions(
      'getRetrospectiveSuccess',
      'getRetrospectiveFail',
      'archiveSuccess',
      'archiveFail'
    );
  }

  getRetrospective(roomcode) {
    $.ajax({ type: 'GET', url: '/api/retrospectives/search_code/' + roomcode })
      .done((data) => {
        this.actions.getRetrospectiveSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getRetrospectiveFail(jqXhr);
      });
  }

  // not implemented
  archive(id) {
    $.ajax({
      type: 'PUT',
      url: '/api/retrospectives',
      data: { id: id}
    })
      .done(() => {
        this.actions.archiveSuccess();
      })
      .fail((jqXhr) => {
        this.actions.archiveFail(jqXhr);
      });
  }

}

export default alt.createActions(RetrospectiveSummaryActions);
