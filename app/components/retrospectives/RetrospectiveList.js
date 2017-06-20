import React from 'react';
import {Link} from 'react-router';
import AuthService from '../../../utils/AuthService';
import {isEqual} from 'underscore';
import RetrospectiveListStore from '../../stores/RetrospectiveListStore';
import RetrospectiveListActions from '../../actions/RetrospectiveListActions';
import Footer from '../global/Footer';
import Navbar from '../global/Navbar';

class RetrospectiveList extends React.Component {
  constructor(props) {
    super(props);
    this.state = RetrospectiveListStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    // For login authentication
    this.createLock();
    if (this.lock.getToken() === null || this.lock.getToken() === undefined) {
        //

    } else {
      RetrospectiveListStore.listen(this.onChange);
      RetrospectiveListActions.getRetrospectives(this.props.params);
    }
  }

  createLock() {
    this.lock = new AuthService(window.location.href);
    this.getUserinfo(this.lock.getToken());
  }

  async getUserinfo(tokenId) {
    this.setState({authToken: this.lock.getToken()});
    console.log(this.lock.authCredentials().domain);
    try {
        let response = await fetch('https://' + this.lock.authCredentials().domain + '/userinfo', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + tokenId,
            },
        });
        let responseJson = await response;
        let responseUserInfo = await response.json();
        if(responseJson !== null || responseJson.status == 200) {
            console.log('Response Status :: ' + responseJson.status + ' - ' + responseJson.statusText);
            console.log(responseUserInfo);
            this.setState({ profile: responseUserInfo});
            var profile = this.state.profile;
            this.setState({userId: profile.user_id});
            // Put some codes if needed

        } else {
            console.log('Response Status :: ' + responseJson.status + ' - ' + responseJson.statusText);
            this.setState({profileError: 'Error in retrieving profile information.'});
        }
    } catch (error) {
        this.setState({authError: error.message});
        console.log('Error in retrieving userinfo from Auth0: ' + error.message);
        this.setState({profileError: 'Error in retrieving profile information.'});
    }
  }

  componentWillUnmount() {
    RetrospectiveListStore.unlisten(this.onChange);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.params, this.props.params)) {
      RetrospectiveListActions.getRetrospectives(this.props.params);
    }
  }

  onChange(state) {
    this.setState(state);
  }

  allowFilterRetrospective() {
    if (!this.state.authError) {
      let retrospectivesList = this.state.retrospectives.map((retrospective, index) => {
        console.log('retrospective ', retrospective);
        return (
          <div key={retrospective._id} className='list-group-item animated fadeIn'>
            <div className='media'>
              <span className='position pull-left'>{index + 1}</span>
              <div className='media-body'>
                <h4 className='media-heading'>
                  <Link to={'/retrospectives/' + retrospective._id}>{retrospective.title}</Link>
                </h4>
                <small>Is Votable: <strong><i className={'glyphicon glyphicon-' + (retrospective.isVotable ? 'ok' : 'remove')}></i></strong></small>
                <br />
                <small>Is Timeboxed: <strong><i className={'glyphicon glyphicon-' + (retrospective.isTimeboxed ? 'ok' : 'remove')}></i></strong></small>
                <br />
                <Link to={'/admin/retrospectives/' + retrospective._id}>Manage</Link>
              </div>
            </div>
          </div>
        );
      });

      return (
        <div>{retrospectivesList}</div>
      );

    } else {
      return (
        <div className='alert alert-danger'>
          <div className='alert-danger'>Error in authenticating user.</div>
        </div>
      );
    }
  }

  render() {


    return (
      <div>
        <Navbar />
          <div className='container'>
            <div className='list-group'>
              {this.allowFilterRetrospective.bind(this)()}
            </div>
          </div>
        <Footer />
      </div>
    );
  }
}

export default RetrospectiveList;
