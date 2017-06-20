import React from 'react';
import {Link} from 'react-router';
import RetrospectiveStore from '../../stores/RetrospectiveStore';
import RetrospectiveActions from '../../actions/RetrospectiveActions';
import {first, without, findWhere} from 'underscore';
import Footer from '../global/Footer';
import Navbar from '../global/Navbar';

class RetrospectiveLanding extends React.Component {

  constructor(props) {
    super(props);    
    this.state = RetrospectiveStore.getState();
    this.onChange = this.onChange.bind(this);
    this.state = { inputRoomCode : '', joinLandingFormSubmitted: false, joinSubmitted : '' , joinRetroId : '', joinRoomUsername : '' };
    this.landing = true;
  }

  componentDidMount() {
    RetrospectiveStore.listen(this.onChange);
  }

  componentWillUnmount() {
    RetrospectiveStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
    
    //this should be triggered only when form submission was done.
    if(this.state.joinLandingFormSubmitted) {      
      try{
        if(this.state.roomCode){
          this.setState({ joinRetroId: this.state._id, joinSubmitted : true });
          this.props.onJoinRetro({ joinSubmitted: true, showModal: true, joinRetroError: false, roomCode: this.state.roomCode });
        } else{
          this.setState({ joinRetroIdError: 'Retrospective with room code (' + this.state.inputRoomCode + ') not found.', joinSubmitted : false });
        }
      }catch(error){
        this.setState({ joinRetroIdError: 'Could not fetch retrospective id.', joinSubmitted : false });
      }
    }
  }

  handleJoinRoomCode(event){
    this.setState({ inputRoomCode : event.target.value });
  }

  handleJoinRoomUsername(event){
    this.setState({ joinRoomUsername : event.target.value });
  }

  handleSubmit(e) {
    RetrospectiveActions.getRetrospective(this.state.inputRoomCode);  
    this.state.joinLandingFormSubmitted = true;
    
    e.preventDefault();
  }

  contentLanding(){
    return (
      <div className="container stage-landing">
        <div className="component-wrapper">
          <div className="component-header">
            <h1>RETROSPECTIVE APPLICATION</h1>
            <hr/>
          </div>
          <div className="component-body">
            <p>Do you and your team run retrospectives? Do some team members need to operate <strong>remotely</strong>?
              Retrospectives help the entire team self-organize and reflect on the process and team, in order to speak
              openly and honestly about areas to improve.
            </p>
            <p>
              The Retrospective Application is designed to facilitate and support ongoing retrospectives for face-to-face
              and virtual teams. The app is a simple, fast, configurable web application built by product people for product people.
            </p>
          </div>
        </div>
        <div className="row component-box">
          <div className="col-md-4">
            <div className="component-box-join">
              <h3>JOIN</h3>
              <div className="component-inner-box-join">
                <p className="sub-title">Enter room code</p>
                <form onSubmit={this.handleSubmit.bind(this)}>
                  <input type="text" onChange={this.handleJoinRoomCode.bind(this)} autoFocus/>
                  <button type="submit" className="create-retro-btn" >Join Retro</button>
                  <span className="has-error">{this.state.joinRetroIdError}</span>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <div className="divider">OR</div>
          </div>
          <div className="col-md-4">
            <div className="component-box-create">
              <h3>CREATE</h3>
              <div className="component-inner-box-create">
                <p className="title">Running the Retro?</p>
                <p className="sub-title">Start your new retro here</p>
                <Link className="create-retro-btn" to="/create">Create Retro</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render(){
    let contentRender = this.contentLanding.bind(this)();
    
    return (
      <div>
        {contentRender}
        <Footer />
      </div>
    );
  }
}

export default RetrospectiveLanding;
