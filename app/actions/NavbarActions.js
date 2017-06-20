import alt from '../alt';
import {assign} from 'underscore';

class NavbarActions {
  constructor() {
    this.generateActions(
      'updateRetroUsers',
      'updateAjaxAnimation'
    );
  }
}

export default alt.createActions(NavbarActions);
