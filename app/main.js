import React from 'react';
import Router from 'react-router';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';

let history = createBrowserHistory();

$(document).ready(function() {
  setTimeout(function() {
    $("[data-toggle=popover]").popover({
        html : true,
        content: function() {
          var content = $(this).attr("data-popover-content");
          return $(content).children(".popover-body").html();
        },
        title: function() {
          var title = $(this).attr("data-popover-content");
          return $(title).children(".popover-heading").html();
        }
    });
  }, 500);


});



ReactDOM.render(<Router history={history}>{routes}</Router>, document.getElementById('app'));
