import alt from '../alt';

class RetrospectiveCreateActions {
  constructor() {
    this.generateActions(
      'createRetrospectiveSuccess',
      'createRetrospectiveFail',
      'updateRoomCode',
      'updateTitle',
      'updateSprintNumber',
      'updateSprintTimer',
      'invalidRoomCode',
      'invalidTitle',
      'openRetrospectiveJoinModal'
    );
  }

  createRetrospective(data) {
    $.ajax({
      type: 'POST',
      url: '/api/retrospectives',
      data: {
        roomCode: data.roomCode,
        title: data.title,
        sprintNumber: data.sprintNumber,
        sprintTimer: data.sprintTimer,
        userId: data.userId
      }
    })
      .done((data) => {
        this.actions.createRetrospectiveSuccess(data.message);
      })
      .fail((jqXhr) => {
        this.actions.createRetrospectiveFail(jqXhr.responseJSON.message);
      });
  }
  
  openJoinModal(data){    
    this.actions.openRetrospectiveJoinModal(data);
  }
}

export default alt.createActions(RetrospectiveCreateActions);
