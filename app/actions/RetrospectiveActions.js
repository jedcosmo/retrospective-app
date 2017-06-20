import alt from '../alt';

class RetrospectiveActions {
  constructor() {
    this.generateActions(
      'getRetrospectiveSuccess',
      'getRetrospectiveFail',
      'startRetrospectiveSuccess',
      'startRetrospectiveFail',
      'updateRetrospectiveSuccess',
      'joinRetrospectiveSuccess',
      'joinRetrospectiveFail',
      'updateUsername',
      'invalidUsername',
      'voteFinishedUserSuccess',
      'voteFinishedUserFail',
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
      'groupThoughtFail',
      'unGroupThoughtSuccess',
      'unGroupThoughtFail'
    );
  }

  getRetrospective(roomCode) {
    $.ajax({
      url: '/api/retrospectives/search_code/' + roomCode
    })
      .done((data) => {
        if(data.stage == "share") {
          var thought = data.thoughts.filter(function(e){ return e.userId == localStorage.getItem('username') });
          data.thoughts = thought;
        }

        this.actions.getRetrospectiveSuccess(data);

      })
      .fail((jqXhr) => {
        this.actions.getRetrospectiveFail(jqXhr);
      });
  }

// async joinUserInRetro(){
//     try{
//       let response = await fetch('/api/retrospectives/add_user/' + this.state.joinRoomUsername+ '/' + this.state.joinRetroId, {
//         method: 'PUT'
//       });
//       let responseJson = await response;
//       let responseJsonInfo = await response.json();

//       if(responseJsonInfo.status == 'success'){
//         this.setState({ joinRetroIntroError: '', joinRetroIntroSuccess: 'You\'ve successfully joined a room, you\'ll be redirected shortly.'});
//         window.location.href = '/retrospectives/' + this.state.joinRetroId;
//       }
//     } catch(error){
//       this.setState({ joinRetroIntroError: 'Could not add user, please contact your administrator.' });
//     }
//   }
  startRetrospective(data) {
    console.log(data);
    var retroData = data;
    $.ajax({
      type: 'PUT',
      url: '/api/retrospectives/add_user/' + retroData.username + '/' + retroData._id
    })
      .done((data) => {
        console.log('inside success: '+retroData._id);
        $.ajax({
          type: 'PUT',
          url: '/api/retrospectives/' + retroData._id,
          data: {
            stage: 'enterthoughts'
          }
        })
          .done((data) => {
            this.actions.startRetrospectiveSuccess(data.message);
          })
          .fail((jqXhr) => {
            this.actions.startRetrospectiveFail(jqXhr.responseJSON.message);
          });
      })
      .fail((jqXhr) => {
        this.actions.startRetrospectiveFail(jqXhr.responseJSON.message);
      });
  }

  joinRetrospective(data){
    var retroData = data;
    $.ajax({
      type: 'PUT',
      url: '/api/retrospectives/add_user/' + retroData.joinName + '/' + retroData._id
    })
      .done((data) => {
        this.actions.joinRetrospectiveSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.joinRetrospectiveFail(jqXhr.responseJSON.message);
      });
  }

  voteFinishedUser(data) {
    $.ajax({
      type: 'PUT',
      url: '/api/retrospectives/vote_finished/' + data.userId + '/' + data.roomCode,
      data: {
        mode: data.mode
      }
    })
      .done((data) => {
        this.actions.voteFinishedUserSuccess(data);
        console.log(data);
          //toastr.info(data.message);
      })
      .fail((jqXhr) => {
        console.log(jqXhr);
        this.actions.voteFinishedUserFail(jqXhr.responseJSON.message);
      });
  }

  updateRetrospective(data) {
    $.ajax({
      type: 'PUT',
      url: '/api/retrospectives/' + data.retrospectiveId,
      data: {
        stage: data.stage,
        displayThoughtPreference: data.displayThoughtPreference,
      }
    })
      .done((data) => {
        this.actions.updateRetrospectiveSuccess(data);



        // need a reference to socket
        // var dataObj = {
        //   eventType: 'updateRetrospective',
        //   roomCode: data.retrospective.roomCode,
        //   eventData: data
        // };

        // this.socket.emit('update', dataObj);
      })
      .fail((jqXhr) => {
        this.actions.updateRetrospectiveFail(jqXhr.responseJSON.message);
      });
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

  unGroupThought(data) {
    $.ajax({
      type: 'PUT',
      url: '/api/retrospectives/'+data.retrospectiveId+'/thoughts/'+data.thoughtid,
      data: { retrospectiveId: data.retrospectiveId,
              unGroup: data.unGroup,
              unGroupId: data.unGroupId,
       }
    })
      .done((data) => {
        this.actions.unGroupThoughtSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.unGroupThoughtFail(jqXhr.responseJSON.message);

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
              categoryId: data.categoryId,
              isHidden: data.isHidden,
       }
    })
      .done((data) => {
        if(data.retrospective.stage == "share") {
          var thought = data.retrospective.thoughts.filter(function(e){ return e.userId == localStorage.getItem('username') });
          data.retrospective.thoughts = thought;
        }
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
        if(data.stage == "share") {
          var thought = data.thoughts.filter(function(e){ return e.userId == localStorage.getItem('username') });
          data.thoughts = thought;
        }
        this.actions.deleteThoughtSuccess(data);

        /*if(categoryId) {
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
        }*/
      })
      .fail((jqXhr) => {
        this.actions.deleteThoughtFail(jqXhr.responseJSON);

      });
  }

}

export default alt.createActions(RetrospectiveActions);
