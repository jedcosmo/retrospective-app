import alt from '../alt';

class ThoughtActions {
  constructor() {
    this.generateActions(
      'getAllThoughtsSuccess',
      'getAllThoughtsFail',
      'getThoughtSuccess',
      'getThoughtFail',
      'createThoughtSuccess',
      'createThoughtFail',
      'updateThoughtSuccess',
      'updateThoughtFail',
      'deleteThoughtSuccess',
      'deleteThoughtFail',
      'voteSuccess',
      'voteFail',
      'groupThoughtSuccess',
      'groupThoughtFail'
    );
  }

  getAllThoughts(roomCode) {
    let url = '/api/retrospectives/'+roomCode+'/thoughts';
    let params = {
      roomCode: roomCode
    };

    // if (payload.unarchived === 'unarchived') {
    //   url = '/api/thoughts/unarchived';
    // }

    $.ajax({ url: url, data: params })
      .done((data) => {
        this.actions.getAllThoughtsSuccess(data);
      })
      .fail((jqXhr) => {
        console.log(jqXhr);
        this.actions.getAllThoughtsFail(jqXhr);
      });
  }

  getThought(roomCode, userId) {
    $.ajax({ url: '/api/retrospectives/'+roomCode+'/thoughts/' + userId })
      .done((data) => {
        this.actions.getThoughtSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getThoughtFail(jqXhr);
      });
  }

  // not implemented
  vote(data) {
    $.ajax({
      type: 'PUT',
      url: '/api/retrospectives/'+data.retrospectiveId+'/thoughts/'+data.thoughtId,
      data: { voteUserId: data.voteUserId }
    })
      .done((data) => {
        this.actions.voteSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.voteFail(jqXhr);
      });
  }

  groupThought(data) {
    $.ajax({
      type: 'PUT',
      url: '/api/retrospectives/'+data.retrospectiveId+'/thoughts/'+data._id,
      data: { _id: data._id,
              categoryId: data.categoryId,
              createdAt: data.createdAt,
              togroup: JSON.stringify(data.togroup),
              groups: data.groups,
              retrospectiveId: data.retrospectiveId,
              text: data.text,
              updatedAt: data.updatedAt,
              userId: data.userId,
              votes: data.votes
      }
    })
      .done((data) => {
        this.actions.groupThoughtSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.groupThoughtFail(jqXhr);
      });
  }

  createThought(data) {
    $.ajax({
      type: 'POST',
      url: '/api/retrospectives/'+data.roomCode+'/thoughts',
      data: {  text: data.text,
              userId: data.userId,
              retrospectiveId: data.roomCode,
              categoryId: data.categoryId
       }
    })
      .done((data) => {
        this.actions.createThoughtSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.createThoughtFail(jqXhr.responseJSON.message);
      });
  }

  updateThought(data) {
    $.ajax({
      type: 'PUT',
      url: '/api/retrospectives/'+data.retrospectiveId+'/thoughts/'+data.thoughtid,
      data: {  text: data.text,
              userId: data.userId,
              retrospectiveId: data.retrospectiveId,
              categoryId: data.categoryId
       }
    })
      .done((data) => {
        this.actions.updateThoughtSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.updateThoughtFail(jqXhr.responseJSON.message);

      });
  }

  deleteThought(data) {
    let categoryId;
    if(data.categoryId) {
      categoryId = data.categoryId;
    }
    $.ajax({
      type: 'DELETE',
      url: '/api/retrospectives/'+data.retrospectiveId+'/thoughts/'+data.thoughtId
    })
      .done((data) => {
        this.actions.deleteThoughtSuccess(data);
        if(categoryId) {
          $('.grouped_' + categoryId).each(function(index) {
            if(index > 0) {
              let siblingLeft = parseInt($(this).css('left').replace(/[^-\d\.]/g, ''));
              let siblingTop = parseInt($(this).css('top').replace(/[^-\d\.]/g, ''));
              let siblingZ = parseInt($(this).css('z-index'));
              $(this).css('left', (siblingLeft + 5) + 'px');
              $(this).css('top', (siblingTop + 5) + 'px');
              $(this).css('z-index', (siblingZ + (-1)));              
            }
          });
        }
      })
      .fail((jqXhr) => {
        this.actions.deleteThoughtFail(jqXhr.responseJSON);

      });
  }
}

export default alt.createActions(ThoughtActions);
