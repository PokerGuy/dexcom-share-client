import alt from '../lib/AltInstance';
import adminAction from '../actions/adminAction';
import ImmutableStore from 'alt/utils/ImmutableUtil';
import constants from '../constants/constants';
import notify from 'bootstrap-growl';

class AdminStore {
    constructor() {
        this.bindListeners({
            loggedIn: adminAction.loggedIn,
            loggedOut: adminAction.loggedOut,
            unsuccessfulLogin: adminAction.unsuccessfulLogin
        });
    }

    loggedIn(token) {
        var msg = $.notify('You have successfully logged in.', {type: 'success'});
        this.setState({token: token});
    }

    loggedOut() {
        var msg = $.notify('You have been logged out.', {type: 'success'});
        this.setState({token: null});
    }

    unsuccessfulLogin() {
        var msg = $.notify('Invalid password.', {type: 'danger'});
    }
}

export default alt.createStore(ImmutableStore(AdminStore));
