import React from 'react';
import {Route} from 'react-router';
import App from './components/App';

import Home from './components/Home';

import Retrospective from './components/retrospectives/Retrospective';
import RetrospectiveLanding from './components/retrospectives/RetrospectiveLanding';
import RetrospectiveCreate from './components/retrospectives/RetrospectiveCreate';
import RetrospectiveCategoryList from './components/retrospectives/RetrospectiveCategoryList';
import RetrospectiveSummary from './components/retrospectives/RetrospectiveSummary';

import MyPdfViewer from './components/MyPdfViewer';

import Login from './components/login/Login';
import UserProfile from './components/login/UserProfile';

import RetrospectiveManage from './components/retrospectives/RetrospectiveManage';
import RetrospectiveList from './components/retrospectives/RetrospectiveList';

export default (
  <Route component={App}>       
    <Route path='/' component={Retrospective} />
    <Route path='/create/:action' component={RetrospectiveCreate} />
    <Route path='/:roomcode/summary' component={RetrospectiveSummary} />
    <Route path='/:roomcode/:usertype' component={Retrospective} />
    <Route path='/:roomcode' component={Retrospective} />

    <Route path='/admin/retrospectives/:id' component={RetrospectiveManage} />
    <Route path='/retrospectives/list/:filter' component={RetrospectiveList} />

  </Route>
);
