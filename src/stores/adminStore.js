import alt from '../lib/AltInstance';
import adminAction from '../actions/adminAction';
import ImmutableStore from 'alt/utils/ImmutableUtil';
import constants from '../constants/constants';

class AdminStore {
    constructor() {
        this.bindListeners({
            loggedIn: adminAction.loggedIn,
            loggedOut: adminAction.loggedOut
        });
    }

    loggedIn(token) {
        this.setState({token: token});
    }

    loggedOut() {
        this.setState({token: null});
    }
}

export default alt.createStore(ImmutableStore(AdminStore));
