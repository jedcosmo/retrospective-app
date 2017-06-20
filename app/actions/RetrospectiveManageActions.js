import alt from '../alt';

class RetrospectiveManageActions {
  constructor() {
    this.generateActions(
      'updateRetrospectiveSuccess',
      'updateRetrospectiveFail',
      'getRetrospectiveSuccess',
      'getRetrospectiveFail',
      'deleteRetrospectiveSuccess',
      'deleteRetrospectiveFail',
      'updateTitle',
      'updateRoomCode',
      'updateSprintNumber',
      'updateSprintTimer',
      'updateStage',
      'updateDisplayThoughtPreference',
      'updateIsVotable',
      'updateIsTimeboxed',
      'invalidTitle',
      'invalidIsVotable',
      'invalidIsTimeboxed'
    );
  }

  updateRetrospective(data) {
    $.ajax({
      type: 'PUT',
      url: '/api/retrospectives/' + data.retrospectiveId,
      data: {
        title: data.title,
        sprintNumber: data.sprintNumber,
        sprintTimer: data.sprintTimer,
        stage: data.stage,
        isVotable: data.isVotable,
        isTimeboxed: data.isTimeboxed,
        displayThoughtPreference: data.displayThoughtPreference,
        roomCode: data.roomCode
      }
    })
      .done((data) => {
        this.actions.updateRetrospectiveSuccess(data.message);
      })
      .fail((jqXhr) => {
        this.actions.updateRetrospectiveFail(jqXhr.responseJSON.message);
      });
  }

  getRetrospective(retrospectiveId) {
    $.ajax({
      url: '/api/retrospectives/' + retrospectiveId
    })
      .done((data) => {
        this.actions.getRetrospectiveSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getRetrospectiveFail(jqXhr);
      });
  }

  deleteRetrospective(retrospectiveId) {
    $.ajax({
      type: 'DELETE',
      url: '/api/retrospectives/' + retrospectiveId
    })
      .done((data) => {
        this.actions.deleteRetrospectiveSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.deleteRetrospectiveFail(jqXhr);
      });
  }
}

export default alt.createActions(RetrospectiveManageActions);
