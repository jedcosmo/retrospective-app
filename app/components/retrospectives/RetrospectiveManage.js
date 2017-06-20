import React from 'react';
import RetrospectiveManageStore from '../../stores/RetrospectiveManageStore';
import RetrospectiveManageActions from '../../actions/RetrospectiveManageActions';
import {clone} from 'underscore';
import Footer from '../global/Footer';
import Navbar from '../global/Navbar';

class RetrospectiveManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = RetrospectiveManageStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    RetrospectiveManageStore.listen(this.onChange);
    RetrospectiveManageActions.getRetrospective(this.props.params.id);
  }

  componentWillUnmount() {
    RetrospectiveManageStore.unlisten(this.onChange);
  }

  componentDidUpdate(prevProps) {
    // Fetch new charachter data when URL path changes
    if (prevProps.params.id !== this.props.params.id) {
      RetrospectiveManageActions.getRetrospective(this.props.params.id);
    }
  }

  onChange(state) {
    this.setState(state);

    if (state.retrospectiveId == -1) {
      this.props.history.push('/admin/retrospectives');
    }
  }

  handleDelete(event) {
    event.preventDefault();

    RetrospectiveManageActions.deleteRetrospective(this.state.retrospectiveId);
    $('#deleteModal').modal('hide');
  }

  handleSubmit(event) {
    event.preventDefault();

    var title = this.state.title.trim();
    var isVotable = this.state.isVotable;
    var isTimeboxed = this.state.isTimeboxed;

    if (!title) {
      RetrospectiveManageActions.invalidName();
      this.refs.titleTextField.getDOMNode().focus();
    }

    if (isVotable !== false && isVotable !== true) {
      RetrospectiveCreateActions.invalidIsVotable();
    }

    if (isTimeboxed !== false && isTimeboxed !== true) {
      RetrospectiveCreateActions.invalidIsTimeboxed();
    }

    if (title) {
      RetrospectiveManageActions.updateRetrospective(clone(this.state));
    }
  }

  render() {
    let thoughts = this.state.thoughts.length == 0 ? ' no thoughts yet' : this.state.thoughts.map((thought, index) => {
      return (
        <div key={index}>
          <ul>
            <li>
              {thought.text}
            </li>
          </ul>
        </div>
      );
    });

    let groups = this.state.groups.length == 0 ? ' no groups yet' : this.state.groups.map((group, index) => {
      return (
        <div key={index}>
          <ul>
            <li>
              {group.title}
            </li>
          </ul>
        </div>
      );
    });

    return (
        <div>
          <Navbar />
          <div className='container'>
            <div className='row flipInX animated'>
              <div className='col-sm-8'>
                <div className='panel panel-default'>
                  <div className='panel-heading'>Manage Retrospective</div>
                  <div className='panel-body'>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                      <div className='form-group'>
                        <label className='control-label'>Room Code</label>
                        <input type='text' className='form-control' ref='roomCodeTextField' value={this.state.roomCode}
                               onChange={RetrospectiveManageActions.updateRoomCode} autoFocus/>
                      </div>
                      <div className={'form-group ' + this.state.titleValidationState}>
                        <label className='control-label'>Title</label>
                        <input type='text' className='form-control' ref='titleTextField' value={this.state.title}
                               onChange={RetrospectiveManageActions.updateTitle} autoFocus/>
                        <span className='help-block'>{this.state.helpBlock}</span>
                      </div>
                      <div className={'form-group ' + this.state.sprintNumberValidationState}>
                        <label className='control-label'>Sprint Number</label>
                        <input type='text' className='form-control' ref='sprintNumberTextField' value={this.state.sprintNumber}
                               onChange={RetrospectiveManageActions.updateSprintNumber} autoFocus/>
                        <span className='help-block'>{this.state.helpBlock}</span>
                      </div>
                      <div className={'form-group ' + this.state.sprintTimerValidationState}>
                        <label className='control-label'>Sprint Timer</label>
                        <input type='text' className='form-control' ref='sprintTimerTextField' value={this.state.sprintTimer}
                               onChange={RetrospectiveManageActions.updateSprintTimer} autoFocus/>
                        <span className='help-block'>{this.state.helpBlock}</span>
                      </div>
                      <div className={'form-group ' + this.state.displayThoughtPreferenceValidationState}>
                        <label className='control-label'>Display Thought Preference</label>
                        <select className='form-control' value={this.state.displayThoughtPreference}
                                onChange={RetrospectiveManageActions.updateDisplayThoughtPreference}>
                          <option value="personal">Personal</option>
                          <option value="department">Department</option>
                          <option value="public">Public</option>
                        </select>
                      </div>
                      <div className={'form-group ' + this.state.stageState}>
                        <label className='control-label'>Stage</label>
                        <select className='form-control' value={this.state.stage}
                                onChange={RetrospectiveManageActions.updateStage}>
                          <option value="initial">Initial</option>
                          <option value="individual">Individual</option>
                          <option value="shared">Shared</option>
                        </select>
                      </div>
                      <div className={'form-group ' + this.state.isVotableValidationState}>
                        <div>
                          <label className='control-label'>Is Votable?</label>
                        </div>
                        <div className='radio radio-inline'>
                          <input type='radio' name='isVotable' id='isVotableFalse' value='false' checked={this.state.isVotable === false}
                                 onChange={RetrospectiveManageActions.updateIsVotable}/>
                          <label htmlFor='isVotableFalse'>No</label>
                        </div>
                        <div className='radio radio-inline'>
                          <input type='radio' name='isVotable' id='isVotableTrue' value='true' checked={this.state.isVotable === true}
                                 onChange={RetrospectiveManageActions.updateIsVotable}/>
                          <label htmlFor='isVotableTrue'>Yes</label>
                        </div>
                      </div>
                      <div className={'form-group ' + this.state.isTimeboxedValidationState}>
                        <div>
                          <label className='control-label'>Is Timeboxed?</label>
                        </div>
                        <div className='radio radio-inline'>
                          <input type='radio' name='isTimeboxed' id='isTimeboxedFalse' value='false' checked={this.state.isTimeboxed === false}
                                 onChange={RetrospectiveManageActions.updateIsTimeboxed}/>
                          <label htmlFor='isTimeboxedFalse'>No</label>
                        </div>
                        <div className='radio radio-inline'>
                          <input type='radio' name='isTimeboxed' id='isTimeboxedTrue' value='true' checked={this.state.isTimeboxed === true}
                                 onChange={RetrospectiveManageActions.updateIsTimeboxed}/>
                          <label htmlFor='isTimeboxedTrue'>Yes</label>
                        </div>
                      </div>
                      <div>
                        <label>Thoughts:</label>
                        {thoughts}
                      </div>
                      <div>
                        <label>Groups:</label>
                        {groups}
                      </div>
                      <button type='submit' className='btn btn-primary'>Update</button>
                      <button type='button' className='btn btn-danger pull-right' data-toggle="modal" data-target="#deleteModal">Delete</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>


            <div className="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title" id="deleteModalLabel">Delete Retrospective</h4>
                  </div>
                  <div className="modal-body">
                    Are you sure you want to delete this Retrospective?
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" data-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-danger" onClick={this.handleDelete.bind(this)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
    );
  }
}

export default RetrospectiveManage;
