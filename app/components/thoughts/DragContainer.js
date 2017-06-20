import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend';
import DragBox from './DragBox';
import { ItemTypes } from './DragItemTypes';
import RetrospectiveStore from '../../stores/RetrospectiveStore';
import RetrospectiveActions from '../../actions/RetrospectiveActions';
import ThoughtStore from '../../stores/ThoughtStore';
import ThoughtActions from '../../actions/ThoughtActions';

var _ = require('underscore');

class DragContainer extends Component {
  constructor(props) {
    super(props);
    this.state = RetrospectiveStore.getState();
    this.onChange = this.onChange.bind(this);
    this.onAddThoughts = this.onAddThoughts.bind(this);
    this.moveBox = this.moveBox.bind(this);
    this.removeThought = this.removeThought.bind(this);
    this.voteThought = this.voteThought.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleUngroup = this.handleUngroup.bind(this);



  }

  componentDidMount() {
    //RetrospectiveStore.listen(this.onChange);
    //RetrospectiveActions.getAllThoughts(this.props.roomCode);
  }

  componentWillUnmount() {
    //RetrospectiveStore.unlisten(this.onChange);
  }

  onChange(state) {
    //this.setState(state);
  }

  moveBox(dragIndex, hoverIndex) {
  }

  isDropped() {
  }

  onAddThoughts(e){
    e.preventDefault();
    let categoryId = $(e.currentTarget).val();
    const thought = {
      text: 'Write a thought',
      userId: localStorage.getItem('username'),
      //userId: this.state.userId, //hardcoded dummy
      roomCode: this.props.roomCode,
      categoryId: categoryId
    };

    RetrospectiveActions.createThought(thought);
  }

  removeThought(thought) {
    RetrospectiveActions.deleteThought(thought);
  }

  voteThought(thought) {
    if(this.props.votesAllowed > 0) {
      //unvote and unvote with votesCasted not maxed out
      RetrospectiveActions.vote(thought);
      this.props.voteStatus(thought);

    }
    else {
      if(thought.voteStatus == 0) {
        //unvote with max votecast
        RetrospectiveActions.vote(thought);
      }
      //pass votestatus to retro
      this.props.voteStatus(thought);
    }
  }

  handleUpdate(thoughtData) {
    this.props.thoughtUpdate(thoughtData);
  }

  onExpand(e) {
    let cat = $(e.currentTarget).data('index');

    if($(e.currentTarget).hasClass('expand')) {
      $(e.currentTarget).removeClass('expand fa-expand');
      $(e.currentTarget).addClass('compress fa-compress');
      $('.category-list-item').not(':eq('+cat+')').hide();
      $('.category-list-item').addClass('full-view');
    }
    else {
      $(e.currentTarget).removeClass('compress fa-compress');
      $(e.currentTarget).addClass('expand fa-expand');
      $('.category-list-item').removeClass('full-view');
      $('.category-list-item').show();
    }
  }

  handleHover(hoverEvent) {
    if(hoverEvent.isOver == true) {
      if(hoverEvent.dropTarget != hoverEvent.dragItem) {
        $('#wrapper_' + hoverEvent.dropTarget).addClass('highlight');
        //$('#' + hoverEvent.dropTarget).parent().css('border', '1px solid #f55757');
      }
    }
    else {
      $('.thought-wrapper').removeClass('highlight');
    }
  }

  handleDrop(index, item, _id) {
    $('.thought-wrapper').removeClass('highlight');
    let groupData =
    {
      item: item,
      _id: _id
    }
    this.props.dropStatus(groupData);
  }

  handleUngroup(thoughtData) {
    this.props.thoughtUnGroup(thoughtData);
  }



  showThoughts() {
    let groupedThoughts;
    let thoughtsList = this.props.thoughts.map(({ stage, text, _id, categoryId, createdAt, groups, retrospectiveId, updatedAt, userId, votes, isHidden }, index) => {
      if(this.props.categoryId == categoryId) {
        let draggable = false;
        if(this.props.stage == 'share') {
          draggable = false;
        }
        else if(this.props.stage == 'group') {
          if(this.props.isAdmin) {
            if(groups.length > 0) {
              draggable = false;
            }
            else {
              draggable = true;
            }
          }
          else {
            draggable = false;
          }
        }
        else if(this.props.stage == 'vote') {
          draggable = false;
        }


        if(isHidden == false) {
          return (
            <div key={index} className="thought-box col-xs-4 col-lg-4">
              <div id={'wrapper_' + _id} className="thought-wrapper">
                <DragBox
                  isOver={this.handleHover}
                  isDropped={this.isDropped(text)}
                  onDrop={item => this.handleDrop(index, item, _id)}
                  canDrag={draggable}
                  accepts={categoryId}
                  id={_id}
                  type={categoryId}
                  groups={groups}
                  retrospectiveId={retrospectiveId}
                  roomCode={this.props.roomCode}
                  stage={this.props.stage}
                  text={text}
                  key={_id}
                  createdAt={createdAt}
                  updatedAt={updatedAt}
                  userId={userId}
                  votes={votes}
                  thoughts={this.props.thoughts}
                  thoughtUpdate={this.handleUpdate}
                  thoughtUnGroup={this.handleUngroup}
                  moveBox={this.moveBox}
                  deleteThought={this.removeThought}
                  voteThought={this.voteThought}
                  votesAllowed={this.state.votesAllowed}
                  votesCasted={this.state.votesCasted}
                  votesMax={this.props.votesMax}
                  isAdmin={this.props.isAdmin}
                />

                {
                  groupedThoughts = groups.map(({ stage, text, id, categoryId, createdAt, groups, retrospectiveId, updatedAt, userId, votes }, index) => {
                    return (
                      <div className={'grouped grouped_' + categoryId}>
                        <div className="thought-inner-box">
                            <div className="thought-input">
                              <div className="thought-content"></div>
                            </div>
                        </div>
                      </div>
                    )
                  })
                }

              </div>
            </div>
          );
        }

      }
    });

    return thoughtsList;
  }

  render() {
    let isAddEnable;
    if(this.props.stage == "share") {
      isAddEnable = true;
    }
    else {
      isAddEnable = false;
    }
    return (
      <div className="thoughts-container">
          {this.showThoughts()}
          <button className={isAddEnable ? "create-thought-btn" : "hidden"} value={this.props.categoryId} onClick={this.onAddThoughts}><i className='fa fa-plus-circle fa-3'></i></button>
          <i className="fa fa-expand expand-btn expand" aria-hidden="true" onClick={this.onExpand} data-index={this.props.categoryId}></i>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(DragContainer);
