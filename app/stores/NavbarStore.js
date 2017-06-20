import alt from '../alt';
import NavbarActions from '../actions/NavbarActions';

class NavbarStore {
  constructor() {
    this.bindActions(NavbarActions);
    this.retroUsers = 0;
    this.ajaxAnimationClass = '';
  }

  onUpdateRetroUsers(data) {
    this.retroUsers = data.count;
  }

  onUpdateAjaxAnimation(className) {
    this.ajaxAnimationClass = className; //fadein or fadeout
  }

}

export default alt.createStore(NavbarStore);
