import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import ContentEditable from 'react-contenteditable';
import RetrospectiveStore from '../../stores/RetrospectiveStore';
import RetrospectiveActions from '../../actions/RetrospectiveActions';
import RetrospectiveCreateStore from '../../stores/RetrospectiveCreateStore';
import RetrospectiveCreateActions from '../../actions/RetrospectiveCreateActions';
import ThoughtStore from '../../stores/ThoughtStore';
import ThoughtActions from '../../actions/ThoughtActions';
import Footer from '../global/Footer';
import Navbar from '../global/Navbar';
import WindowModal from '../global/WindowModal';
import DragContainer from '../thoughts/DragContainer';
var _ = require('underscore');

class RetrospectiveCategoryList extends React.Component {
  constructor(props) {
    super(props);

    this.state = RetrospectiveStore.getState();
    this.onChange = this.onChange.bind(this);

    //Modal states and binding
    this.state.joinSubmitted = false;
    this.state.joinName = '';
    this.state.retroStarted = false;
    this.handleJoinName = this.handleJoinName.bind(this);
    this.handleJoinSubmit = this.handleJoinSubmit.bind(this);
    this.handleSaveClose = this.handleSaveClose.bind(this);
    this.handleCloseNoSaving = this.handleCloseNoSaving.bind(this);
    this.handleRetroStarted = this.handleRetroStarted.bind(this);
    this.handleChangeStage = this.handleChangeStage.bind(this);
    this.handleVote = this.handleVote.bind(this);
    this.handleSubmitCode = this.handleSubmitCode.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleUngroup = this.handleUngroup.bind(this);





    //End of modal states and binding.

    if (this.props.usertype == 'admin') {
      this.state.isAdmin = true;
    }

    this.socket = this.props.socket;
  }

  componentDidMount(){
    //this is to make sure if from new created retro that is not yet save or already existing retro.
    if(this.props.retrospective.roomCode){
      this.state.title = this.props.retrospective.title;
      this.state.roomCode = this.props.retrospective.roomCode;
      this.state.sprintTimer = this.props.retrospective.sprintTimer;
      this.state.sprintNumber = this.props.retrospective.sprintNumber;
    }

    //this will run before modals, so this line will only render when the page is refreshed
    RetrospectiveStore.listen(this.onChange);
    RetrospectiveActions.getRetrospective(this.props.roomcode);

    this.setupSocketHandlers();
  }

  componentWillUnmount() {
    RetrospectiveStore.unlisten(this.onChange);
  }

  componentDidUpdate(prevProps) {
  }

  onChange(state) {
    this.setState(state);
    console.log(this.state);
  }

  // socket handler
  setupSocketHandlers() {
    var join_ctr = 0;
    var stageTitle = ''; 
    
    //make sure that socket set before doing something.
    if(this.socket) {

      // Join the server
      this.socket.emit('joinServer', this.props.roomcode ? this.props.roomcode : this.props.retrospective.roomCode);

      //user and retrospective actions for socket.io should be here..
      this.socket.on('update', (data) => {
        //console.log('update: ' + data);
        //console.log(data);

        switch(data.eventType){
          case "updateRetrospective":
            // testing logging out data when retrospective is updated
            // do a hard refresh
            //console.log(data.eventData);

            RetrospectiveActions.updateThought(data.eventData);

            if(data.eventData.updateStatus == 'group') {
              if(this.state.isAdmin) {
                $('#'+ data.eventData.toGroupId).attr('disabled', false).focus().select();
              }
              toastr.success('Thought has been grouped', 'Administrator');
            }
            
            break;
          case "updateStage":
            const updateStageData = {
              retrospectiveId: this.props.roomcode,
              stage: data.eventData
            };

            if(data.eventData == 'share') {
              updateStageData.displayThoughtPreference = 'personal';
            }

            else if(data.eventData == 'archive') {
              let route = '/' + this.state.roomCode + '/summary';
              //go hard reset and reload thw whole retro
              window.location.href = route;
            }

            else {
              updateStageData.displayThoughtPreference = 'all';
            }
                           
            if(data.eventData == "group") {      
              stageTitle = 'DISCUSS THOUGHTS';
            }
            else if(data.eventData == "vote") {      
              stageTitle = 'VOTE ON THOUGHTS';
            }
            else if(data.eventData == "votereview") {      
              stageTitle = 'DISCUSS VOTES';
            }else{
              stageTitle = '';
            }
            
            if(!this.state.isAdmin && stageTitle) {
              toastr.info( stageTitle, 'Retrospective Stage Changed!');
            }

            RetrospectiveActions.updateRetrospective(updateStageData);

            //import whole retro on another stage
            RetrospectiveActions.getRetrospective(this.props.roomcode);
            // change the stage of the retro OR re-pull the retro data
            // do a hard refresh
            //console.log(data.eventData);
            console.log('setupSocketHandlers --> updateStage');
            break;
          case "joinedRetrospective":
            join_ctr++;
            //Show toastr notification when other user just joined/not user itself.
            if( this.state.joinName != data.eventData ){
              toastr.success(data.eventData, 'New User Joined');
            }else{
              toastr.success(data.eventData, 'Welcome to RetroApp!');
            }

            //this should be done only in admin part modal lists of attendees.
            if(this.state.isAdmin) {
              RetrospectiveActions.getRetrospective(data.roomCode);
            }


            break;
          case "startedRetrospective":
            //this will send other users that retro was started by admin already.
            this.setState({ retroStarted: true });
            this.props.onRetroStarted({ retroStarted: true, roomCode: data.roomCode, event: data.eventData, isAdmin: this.state.isAdmin });

            //force stage from setup to share for both admin and attendee
            const updateData = {
              retrospectiveId: this.props.roomcode,
              stage: 'share'
            };

            RetrospectiveActions.updateRetrospective(updateData);

            //import whole retro after updating in another stage
            RetrospectiveActions.getRetrospective(this.props.roomcode);

            //notify attendees that retro was started already.
            if(!this.state.isAdmin){
              toastr.info('Retrospective Started');
            }

            break;
          case 'userRetrospectiveVoting':
            //the broadcasting of finished voting should be done for admin level.
            if(this.state.isAdmin) {
              //notify admin if attendee just finished voting.
              if(data.eventData.status == 'done' && this.state.joinName != data.eventData.userId){
                toastr.info(data.eventData.userId + ' just finished voting.');
              }

              RetrospectiveActions.getRetrospective(this.props.roomcode);
            }

            break;

          default:
            break;
        }
      });
    }
  }
  
  handleVote(thought) {

    const voteData =
    {
      roomCode: this.props.roomcode,
      userId: localStorage.getItem('username'),
    };
    var dataObj;

    //make sure user used all of its votes allowed count
    if((thought.votesCasted == this.state.votesMax) && (thought.votesAllowed == 0)) {

      voteData.mode = "add";
      RetrospectiveActions.voteFinishedUser(voteData);

      toastr.info('You just finished voting.');

      dataObj = {
        roomCode: this.props.roomcode,
        eventType: 'userRetrospectiveVoting',
        eventData: { userId: localStorage.getItem('username'), status: 'done' }
      };
    }
    else {
      voteData.mode = "remove";
      RetrospectiveActions.voteFinishedUser(voteData);

      dataObj = {
        roomCode: this.props.roomcode,
        eventType: 'userRetrospectiveVoting',
        eventData: { userId: localStorage.getItem('username'), status: 'remove' }
      };
    }

    this.socket.emit('update', dataObj);

  }

  handleDrop(dropData) {
    this.state.thoughts.map(box => {
      if (box._id === dropData._id) {
        box.togroup = dropData.item;
        RetrospectiveActions.groupThought(box);
      }
    });

    let thoughtData =
    {
      retrospectiveId: this.props.roomcode,
      thoughtid: dropData.item.id,
      isHidden: true,
      toGroupId: dropData._id,
      updateStatus: 'group'
    };


    let dataObj = {
      roomCode: this.props.roomcode,
      eventType: 'updateRetrospective',
      eventData: thoughtData
    };

    this.socket.emit('update', dataObj);

  }

  handleUpdate(thoughtData) {
    let dataObj = {
      roomCode: this.props.roomcode,
      eventType: 'updateRetrospective',
      eventData: thoughtData
    };
    this.socket.emit('update', dataObj);

  }

  //start functions that will handle modal callbacks.
  handleJoinName(nameState){
    this.setState({ joinName: nameState });
  }

  //This will handle the "Introduce Yourself" submit form from modal.
  handleJoinSubmit(submitState) {
    //do emit when action from modal is triggered.
    if(submitState.joinSubmitted && submitState.joinName.trim()) {
      RetrospectiveActions.joinRetrospective(this.state);

      var dataObj = {
        roomCode: this.props.roomcode,
        eventType: 'joinedRetrospective',
        eventData: submitState.joinName
      };

      this.socket.emit('update', dataObj);
    }
    this.setState({ joinSubmitted: submitState.joinSubmitted });
  }

  handleSubmitCode(submitState) {
    //do something about the submitted join by room code modal.
  }

  handleSaveClose(saveState) {
    //let's just send back in landing page.
    if(saveState.doSaveClose){
      this.props.onSaveClose(saveState);
    }
  }

  handleCloseNoSaving(closeState) {
    //do process here if modal for admin was closed.
  }

  handleRetroStarted(startState){
    this.setState({ retroStarted: startState.retroStarted });
    this.props.onRetroStarted({ retroStarted: startState.retroStarted });
    //do emit when action from modal is triggered.
    if(startState.retroStarted) {
      var dataObj = {
        roomCode: this.props.roomcode,
        eventType: 'startedRetrospective',
        eventData: 'close-modals'
      };

      this.socket.emit('update', dataObj);
    }
  }
  //end of modals.

  handleChangeStage(stage) {
    var dataObj = {
      roomCode: this.props.roomcode,
      eventType: 'updateStage',
      eventData: stage
    };

    this.socket.emit('update', dataObj);
  }

  handleUngroup(thoughtData) {
    let thought =
    {
      unGroup: true,
      unGroupId: thoughtData.thoughtId,
      retrospectiveId: this.props.roomcode,
      thoughtid: thoughtData.parentId
    };

    RetrospectiveActions.unGroupThought(thought);

    let unGroupData =
    {
      retrospectiveId: this.props.roomcode,
      thoughtid: thoughtData.thoughtId,
      isHidden: false,
      updateStatus: 'ungroup'
    };


    let dataObj = {
      roomCode: this.props.roomcode,
      eventType: 'updateRetrospective',
      eventData: unGroupData
    };

    this.socket.emit('update', dataObj);
  }

  showCategoryList(){
    let categoriesList = _.map(this.state.categories, (category, index) => {
      var id = index;
      return (
        <div key={index} className='category-list-item list-group-item col-lg-6 animated fadeIn'>
          <div className='media'>
            <div className='media-body'>
              <h4 className='media-heading'>
                {category.toUpperCase()}
              </h4>
              <DragContainer
                dropStatus={this.handleDrop}
                thoughts={this.state.thoughts}
                roomCode={this.props.roomcode}
                stage={this.state.stage}
                displayThoughtPreference={this.state.displayThoughtPreference}
                isAdmin={this.state.isAdmin}
                voteStatus={this.handleVote}
                categoryId={index}
                key={index}
                thoughtUpdate={this.handleUpdate}
                thoughtUnGroup={this.handleUngroup}
                votesAllowed={this.state.votesAllowed}
                votesCasted={this.state.votesCasted}
                votesMax={this.state.votesMax}
              />
            </div>
          </div>
        </div>
      );
    });
    return categoriesList;
  }

  render() {
    let linkLabel;
    let stageTitle;

    if(this.state.stage == "share") {
      linkLabel = 'DISCUSS THOUGHTS ';
      stageTitle = 'SHARE THOUGHTS';
    }
    else if(this.state.stage == "group") {
      linkLabel = 'VOTE ON THOUGHTS ';
      stageTitle = 'DISCUSS THOUGHTS';
    }
    else if(this.state.stage == "vote") {
      linkLabel = 'DISCUSS VOTES ';
      stageTitle = 'VOTE ON THOUGHTS';
    }
    else if(this.state.stage == "votereview") {
      linkLabel = 'GO TO SUMMARY ';
      stageTitle = 'DISCUSS VOTES';
    }

    return(
         <div>
             <Navbar retroStarted={this.state.retroStarted}
                    stageTitle={stageTitle}
                    joinName={ this.state.joinName }
                    isAdmin={ this.state.isAdmin }
                    stage={this.state.stage}
                    thoughts={this.state.thoughts}
                    votesCasted={this.state.votesCasted}
                    votesAllowed={this.state.votesAllowed}
                    votesMax={this.state.votesMax}
                    roomCode={this.props.roomcode}
                    retroTitle={this.state.title}
                    retroSprint={this.state.sprintNumber}
                    retroTimer={this.state.sprintTimer}
                    retroJoinedUsers={this.state.joinedUsers} />
             <div className="category-container">
                 {this.showCategoryList()}
             </div>
             <WindowModal
                  socket={ this.props.socket }
                  retroState={ this.state }
                  initialJoinSubmitted={ this.state.joinSubmitted }
                  initialJoinName={ this.state.joinName }
                  initialShowModal={ this.props.showModal }
                  joinRetroError={ null }
                  isAdmin={ this.state.isAdmin }
                  onChange={ this.handleJoinName }
                  onSubmit={ this.handleJoinSubmit }
                  onSaveClose={ this.handleSaveClose }
                  onCloseNoSaving={ this.handleCloseNoSaving }
                  onSubmitCode={this.handleSubmitCode}
                  onStartRetro={ this.handleRetroStarted } />
             <Footer retroStarted={ this.state.retroStarted }
                     isAdmin={ this.state.isAdmin }
                     setStage={this.handleChangeStage}
                     currentStage={this.state.stage}
                     retroJoinedUsers={this.state.joinedUsers}
                     usersFinishedVote={this.state.usersFinishedVote}
                     roomCode={this.props.roomcode}
                     linkURL={'/'}
                     linkLabel={linkLabel} />
       </div>
    );
  }

}

export default RetrospectiveCategoryList;
