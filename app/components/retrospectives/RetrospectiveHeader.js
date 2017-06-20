import React from 'react';
import Timer from '../global/Timer';

class RetrospectiveHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidUpdate(prevProps) {
  }

  onChange(state) {
  }

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#retrospective-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">{this.props.retrospective.title}</a>
          </div>

          <div className="collapse navbar-collapse" id="retrospective-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right">
              <li><a href="#">Stage: {this.props.retrospective.stage}</a></li>
              <li><a href="#">[Placeholder for User/Admin]</a></li>
              <li><a href="#"><Timer initialTimeRemaining={500000} /></a></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default RetrospectiveHeader;
