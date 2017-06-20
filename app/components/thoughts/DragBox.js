import React, { Component, PropTypes } from 'react';
import { ItemTypes } from './DragItemTypes';
import { DragSource, DropTarget } from 'react-dnd';
import ContentEditable from 'react-contenteditable';
import RetrospectiveStore from '../../stores/RetrospectiveStore';
import RetrospectiveActions from '../../actions/RetrospectiveActions';

var _ = require('underscore');

const dragboxSource = {
  beginDrag(props, monitor) {
    $('body').css('cursor', 'pointer');
    return {
        id: props.id,
        text: props.text,
        categoryId: props.type,
        groups: props.groups,
        retrospectiveId: props.retrospectiveId,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
        userId: props.userId,

    };
  },

  endDrag(props, monitor) {
    $('body').css('cursor', 'auto');
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    /*if (dropResult) {
      console.log(`You dropped ${item.text} into ${dropResult.name}!`);
    }*/

    $('.thought-input').css('border', 'none');
  },

  canDrag: function(props, monitor) {
    return props.canDrag;
  },
};

const dragboxTarget = {
  hover(props, monitor, component) {
    const dragItem = monitor.getItem();
    const dropTarget = component;

    const hoverEvent = {
      isOver: monitor.isOver(),
      dragItem: dragItem.id,
      dropTarget: dropTarget.props.id
    }

    props.isOver(hoverEvent);

  },
  drop(props, monitor, component) {
    const dragItem = monitor.getItem();
    const dropTarget = component;

    if(dragItem.id != dropTarget.props.id) {
      props.onDrop(monitor.getItem());
      return {name: props.text}
    }
    else {
      return undefined;
    }
  },
};

function collect(connect, monitor, component) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    isDropped: monitor.didDrop(),
  }
}

function prepare(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}

class DragBox extends Component {
  constructor(props) {
    super(props);
    this.onRemoveThought = this.onRemoveThought.bind(this);
    this.onVote = this.onVote.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUngroup = this.handleUngroup.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleHover = this.handleHover.bind(this);

  }

  handleClick(e) {
    this.props.setStage(nextStep);
  }

  onRemoveThought(e){
    e.preventDefault();
    const thought =
    {
      retrospectiveId: this.props.roomCode,
      thoughtId: this.props.id
    };
    this.props.deleteThought(thought);

    //ThoughtActions.deleteThought(thought);
    //$(e.currentTarget).closest('.thought-box').remove();
    //const thoughts = this.state.thoughts.filter(item => (item._id !== this.props.id ));
  }

  onVote(e) {

    let votesArray = [];
    _.map(this.props.thoughts, (thought, index) => {
      if(_.indexOf(thought.votes, localStorage.getItem('username')) >= 0) {
        votesArray.push(localStorage.getItem('username'));
      }
    });

    let votesCasted = votesArray.length;
    let votesAllowed = this.props.votesMax - votesArray.length;

    const thought =
    {
      voteUserId: localStorage.getItem('username'),
      retrospectiveId: this.props.roomCode,
      thoughtId: this.props.id
    };

    if($(e.currentTarget).prev().hasClass('white-bg')) {
      //voting up
      if(votesAllowed > 0) {
        $(e.currentTarget).prev().removeClass('white-bg');
        $(e.currentTarget).prev().addClass('red-bg');
        $(e.currentTarget).addClass('white-bg');
      }
      else {
        return false;
      }

      thought.voteStatus = 1;
      thought.votesCasted = votesCasted + 1;
      thought.votesAllowed = votesAllowed - 1;

    }
    else {
      thought.voteStatus = 0;
      thought.votesCasted = this.props.votesCasted - 1;
      thought.votesAllowed = this.props.votesAllowed + 1;
      $(e.currentTarget).prev().removeClass('red-bg');
      $(e.currentTarget).prev().addClass('white-bg');
      $(e.currentTarget).removeClass('white-bg');

    }

    this.props.voteThought(thought);

  }

  //onChange: update when typing
  //onBlur: update when clicked but not edited
  handleChange(e) {
    let element = $(e.currentTarget);
    if (element.val() == '') {
      element.val('');
    } else {
      let thoughtVal = element.val();
      let retrospectiveId = element.data('retroid');
      let thoughtid = element.attr('id');
      let thought =
      {
        text: thoughtVal,
        retrospectiveId: retrospectiveId,
        thoughtid: thoughtid
      };

      this.props.thoughtUpdate(thought);
      //RetrospectiveActions.updateThought(thought);

    }
  }

  handleEnter(e) {
    if ((e.keyCode == 10 || e.keyCode == 13)) {
        e.preventDefault();
        $(e.currentTarget).blur();
        console.log($(e.currentTarget).html());
    }
  }

  handleFocus(e) {
    let element = $(e.currentTarget);
    let thoughtVal = element.val();
    if (thoughtVal == "Write a thought") {
      element.val('');
    }



  }

  handleHover(e) {
    if(this.props.stage == "group") {
      $("[data-toggle=popover]").popover({
          html : true,
          content: function() {
            var content = $(this).attr("data-popover-content");
            return $(content).children(".popover-body").html();
          },
          title: function() {
            var title = $(this).attr("data-popover-content");
            return $(title).children(".popover-heading").html();
          },

      });
    }
    else {
      e.stopPropagation();
    }

  }

  handleUngroup(e) {
    e.stopPropagation();
    if(this.props.isAdmin) {
      let thoughtId = $(e.currentTarget).data('thoughtid');
      let parentId = $(e.currentTarget).data('parentid');
      let thoughtData =
      {
        thoughtId: thoughtId,
        parentId: parentId
      }
      this.props.thoughtUnGroup(thoughtData);
    }

  }

  showGroupList() {
    let isHidden;
    if(this.props.isAdmin) {
      isHidden = false;
    }
    else {
      isHidden = true;
    }
    let groupList = this.props.groups.map(({ text, id }, index) => {
      return (
        <div key={'grouplist-item-' + id} onClick={this.handleUngroup} data-thoughtid={id} data-parentid={this.props.id}>
          <div className="thought-in-group">
            <span>{text}</span>
            {
              isHidden ? '' : <span className="ungroup-btn">x</span>
            }

          </div>
        </div>
      )
    })


    return groupList;

  }

  render() {

    const { connectDragSource, isDragging, isDropped, connectDropTarget, isOver, canDrop, share } = this.props;
    const { name } = this.props;
    let isEditDisable;
    let isVotable;
    let isDeletable;
    let voteCountDisplay;
    let thumbsDisplay;
    let unGrouping;
    //share mode
    if(this.props.stage == 'share') {
      isEditDisable = false;
      isDeletable = true;
      isVotable = false;
      voteCountDisplay = false;
      thumbsDisplay = true;
      unGrouping = false;
    }
    else if(this.props.stage == 'group') {
      isEditDisable = true;
      isDeletable = false;
      isVotable = false;
      voteCountDisplay = false;
      thumbsDisplay = true;
      unGrouping = true;
    }
    else if(this.props.stage == 'vote') {
      isEditDisable = true;
      isDeletable = false;
      isVotable = true;
      voteCountDisplay = false;
      thumbsDisplay = true;
      unGrouping = false;
    }

    else if(this.props.stage == 'votereview') {
      isEditDisable = true;
      isDeletable = false;
      isVotable = true;
      voteCountDisplay = true;
      thumbsDisplay = false;
      unGrouping = false;
    }

    let isVoted = false;
    let voteUserSearch = _.indexOf(this.props.votes, localStorage.getItem('username'));


    if(voteUserSearch >= 0) {
      isVoted = true;
    }

    return connectDragSource(connectDropTarget(
      <div className={this.props.isGroup ? 'grouped grouped_' + this.props.type : ''}>
        <div className="thought-inner-box" style={{ opacity: isDragging ? 0 : 1}}>
          <button type="button" style={{ display: isDeletable ? 'inline' : 'none' }} className="close" aria-label="Close" onClick={this.onRemoveThought}><span aria-hidden="true">&times;</span></button>
            <div className="thought-input">
              <textarea
                id = {this.props.id}
                className = "thought-content"
                data-ref={this.props.type}
                data-retroid = {this.props.retrospectiveId}
                 // innerHTML of the editable div
                disabled={isEditDisable}       // use true to disable edition
                //onChange={this.handleChange} // handle innerHTML change
                defaultValue={this.props.text}
                onFocus={this.handleFocus}
                onBlur={this.handleChange}
                onKeyDown={this.handleEnter} >
              </textarea>
              <div className="row">
                <div style={{ opacity: isVotable ? 1 : 0}} className="thought-votes col-md-9 col-lg-9">
                  <div style={{ display: voteCountDisplay ? 'inline-block' : 'none', opacity: (this.props.votes.length == 0) ? 0 : 1 }} className="thought-total-votes">{this.props.votes ? this.props.votes.length : ''} <i className="fa fa-thumbs-o-up"></i></div>
                    <div style={{ display: thumbsDisplay ? 'inline-block' : 'none'}}>
                        {
                            isVoted ?
                                <span className="fa-stack fa-1x">
                          <i className="fa fa-circle fa-stack-2x red-bg"></i>
                          <i className="fa fa-thumbs-o-up fa-stack-1x white-bg" onClick={this.onVote}></i>
                        </span>
                                :
                                <span className="fa-stack fa-1x">
                          <i className="fa fa-circle fa-stack-2x white-bg"></i>
                          <i className="fa fa-thumbs-o-up fa-stack-1x" onClick={this.onVote}></i>
                        </span>
                      }
                    </div>
                  </div>
                  <div className="thought-votes-count-wrap" onMouseEnter={this.handleHover} tabIndex="0" data-toggle="popover" id={"popover-trigger" + this.props.id} data-trigger="hover" data-container={"#popover-trigger" + this.props.id} data-popover-content={unGrouping ? "#popover-wrapper_" + this.props.id : "" } data-placement="left">
                    <div className="thought-votes-count col-md-3 col-lg-3">{this.props.groups.length ? (this.props.groups.length + 1) : ''}</div>
                  </div>
                  <div id={"popover-wrapper_" + this.props.id} className="hidden popover-container">
                      <div className="popover-body">{this.showGroupList()}</div>
                  </div>
              </div>
            </div>
        </div>
      </div>

    ));
  }
}

DragBox.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isDropped: PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
  accepts: PropTypes.string.isRequired,
  groups: PropTypes.arrayOf(PropTypes.object).isRequired,
  moveBox: React.PropTypes.func.isRequired
};


let DragSourceDecorator = DragSource(function(props) { return props.type; }, dragboxSource, collect);
let DropTargetDecorator = DropTarget(function(props) { return props.type; }, dragboxTarget, prepare);

export default DropTargetDecorator(DragSourceDecorator(DragBox));
//export default DragSource(function(props) { return props.type; }, dragboxSource, collect)(DragBox);
