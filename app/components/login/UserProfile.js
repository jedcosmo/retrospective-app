import React from 'react';
import AuthService from '../../../utils/AuthService';
import Moment from 'moment';
import Footer from '../global/Footer';
import Navbar from '../global/Navbar';

class UserProfile extends React.Component {

  constructor(props) {
  super(props);
  this.state = { profile: null};
  this.onClick = this.onClick.bind(this);

  }

  componentDidMount() {
    // For login authentication
    this.createLock();
    if (this.lock.getToken() === null || this.lock.getToken() === undefined) {
      //

    } else {
      console.log(this.state);
      //console.log(this.lock.getToken());
    }
  }

  /*onClick(state) {
   this.setState(state);
   }*/

  onClick(e) {
    this.updateProfile(this.state, this.refs);
  }

  createLock() {
    this.lock = new AuthService(window.location.href);
    localStorage.setItem('authToken', this.lock.getToken());
    this.getUserinfo(this.lock.getToken());
  }

  async getUserinfo(tokenId) {
    this.setState({authToken: this.lock.getToken()});
    localStorage.setItem('authDomain', this.lock.authCredentials().domain);
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
        this.setState({profileName: profile.name});
        this.setState({profilePic: profile.picture});
        this.setState({profileEmail: profile.email});
        this.setState({profileEmailVerified: profile.email_verified});
        this.setState({profileUserId: profile.user_id});
        // Save user_id in a local storage
        localStorage.setItem('userId', this.state.profileUserId);
        // Convert Date Created/Updated fields with Timezone into readable dates
        var profileCreatedAtReadable = Moment(profile.created_at, "YYY-MM-DDTHH:mm:ssZ").toDate();
        var createdAtObj = JSON.parse('{"createdAt": "' + profileCreatedAtReadable + '"}');
        this.setState({profileCreatedAtReadable: createdAtObj});
        this.setState({profileCreatedAt: this.state.profileCreatedAtReadable.createdAt});
        var profileUpdatedAtReadable = Moment(profile.updated_at, "YYY-MM-DDTHH:mm:ssZ").toDate();
        var UpdatedAtObj = JSON.parse('{"updatedAt": "' + profileUpdatedAtReadable + '"}');
        this.setState({profileUpdatedAtReadable: UpdatedAtObj});
        this.setState({profileUpdatedAt: this.state.profileUpdatedAtReadable.updatedAt});

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

  updateProfile(state, refs) {
    var lock = new AuthService(window.location.href);
    var userProfile = new UserProfile();
    refs.verifyNow.innerHTML = 'Verifying...';
    $.ajax({
      headers: {
        Authorization: 'Bearer ' + lock.authAPI().token,
      },
      url: 'https://' + localStorage.getItem('authDomain') + '/api/v2/users/' + localStorage.getItem('userId'),
      data: { email_verified: true },
      type: 'PATCH',
      cache: false,
      success: function(data) {
        console.log('Profile updated.');

        $.ajax({
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('authToken'),
          },
          url: 'https://' + localStorage.getItem('authDomain') + '/userinfo',
          type: 'GET',
          success: function(response) {
            console.log(response);
            console.log(state.profileEmailVerified);
            this.setState({ profile: response});
            var profile = this.state.profile;
            this.setState({profileEmailVerified: profile.email_verified});
            console.log(this.state.profileEmailVerified);


          }.bind(this),
          error: function() {
            console.log('Error in updating profile information.');
          }.bind(this)
        });
      }.bind(this),
      error: function() {
        console.log('Error in updating profile information.');
      }.bind(this)
    });
  }

  showUserProfile(){
    if (!this.state.authError) {
      if (this.state.profile) {
        if (!this.state.profileEmailVerified) {
          var profileEmailVerifiedLink = <span><a href="javascript:void(0)" onClick={this.onClick}>Verify Now</a></span>;
        } else {
          var profileEmailVerifiedLink = '';
        }
        return (
          <div className='container'>
            <div className='row flipInX animated'>
              <div className='col-sm-10'>
                <div className='panel panel-default'>
                  <div className='panel-heading'><h4>{this.state.profileName}</h4></div>
                  <div className='panel-body'>
                    <div className='row'>
                      <div className='col-sm-4'>
                        <img src={this.state.profilePic} className='img-thumbnail rounded profile-pic' alt='Profile picture' />
                      </div>
                      <div className='col-sm-8'>
                        <div className='panel-heading title'>Email</div>
                        <div className='panel-heading description'><strong>{this.state.profileEmail}</strong></div>
                        <div className='panel-heading title'>Is your email verified?</div>
                        <div ref='profileEmailVerified' className={(this.state.profileEmailVerified) ? 'panel-heading yes-description' : 'panel-heading no-description'}>
                          {(this.state.profileEmailVerified) ? 'Yes' : 'No'}
                            <span ref='verifyNow' className='space'>
                      {profileEmailVerifiedLink}
                      </span>
                        </div>
                        <div className='panel-heading title'>Date Created</div>
                        <div className='panel-heading description'><strong>{this.state.profileCreatedAt}</strong></div>
                        <div className='panel-heading title'>Date Updated</div>
                        <div className='panel-heading description'><strong>{this.state.profileUpdatedAt}</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else if(!this.state.profile) {
        return (
          <div className='container'>
            <div className='panel-heading'>Loading profile...</div>
          </div>
        );
      } else if(this.state.profileError) {
        return (
          <div className='container'>
            <div className='alert alert-danger'>
              <div>{this.state.profileError}</div>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div className='container'>
          <div className='alert alert-danger'>
            <div className='alert-danger'>Error in authenticating user.</div>
          </div>
        </div>
      );
    }
  }

  render() {
    return(
      <div>
        <Navbar />
        {this.showUserProfile.bind(this)()}
        <Footer />
      </div>
    );
  }
}

export default UserProfile;
