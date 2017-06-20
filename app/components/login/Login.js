import React from 'react';

class Login extends React.Component {
	constructor(props) {
      super(props);
      this.state = {
        clientID: process.env.AUTH0_CLIENT_ID,
        domain: process.env.AUTH0_DOMAIN
      };
      this.onClick = this.onClick.bind(this);
      this.showLock = this.showLock.bind(this);
    }

	componentDidMount() {
	  this.createLock();
	  //this.setState({idToken: this.getIdToken()})
	}

    createLock() {
      this.lock = new Auth0Lock('0X3eg2jHjykwI8Tu49p7c3UGGk6EnSEP', 'jifarillas.auth0.com');
    }

    onClick(state) {
    this.setState(state);
  }

    showLock() {
    // Show the Auth0Lock widget
    //alert('test');
    this.lock.show();
  }
  
	render() {
	  return (
	  	<div>
	      <a onClick={this.showLock}>Sign In</a>
	    </div>
	 );
	}
}

export default Login;
