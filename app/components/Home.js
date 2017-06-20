import React from 'react';
import {Link} from 'react-router';
import AuthService from '../../utils/AuthService';
import HomeStore from '../stores/HomeStore';
import HomeActions from '../actions/HomeActions';
import {first, without, findWhere} from 'underscore';
import Footer from './global/Footer';
import Navbar from './global/Navbar';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = HomeStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    // For login authentication
    this.createLock();
    if (this.lock.getToken() === null || this.lock.getToken() === undefined) {
        //

    } else {
      HomeStore.listen(this.onChange);
      HomeActions.getRetrospectives();
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
    HomeStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleClick(retrospective) {
    // var winner = retrospective._id;
    // HomeActions.vote(winner, loser);
  }

  allowHome() {
    if (!this.state.authError) {
      var retrospectiveNodes = this.state.retrospectives.map((retrospective, index) => {
        return (
            <div key={retrospective._id} className='list-group-item animated fadeIn'>
              <div className='media'>
                <span className='position pull-left'>{index + 1}</span>
                <div className='media-body'>
                  <h4 className='media-heading'>
                    <Link to={'/retrospectives/' + retrospective._id}>{retrospective.title}</Link>
                    <Link className='pull-right' to={'/retrospectives/summary/' + retrospective._id}>View Summary</Link>
                  </h4>
                  <small>Is Votable: <strong>{retrospective.isVotable}</strong></small>
                  <br />
                  <small>Is Timeboxed: <strong>{retrospective.isTimeboxed}</strong></small>
                  <br />
                </div>
              </div>
            </div>
        );
      });

      return (
        <div>{retrospectiveNodes}</div>
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
          <div className='container'>
            <div className='list-group'>
              {this.allowHome.bind(this)()}
            </div>
          </div>
          <Footer />
        </div>
    );
  }
}

export default Home;
