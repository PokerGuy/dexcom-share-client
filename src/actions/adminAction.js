import alt from '../lib/AltInstance';
import Immutable   from 'immutable';
import AltInstance from 'lib/AltInstance';
import request from 'superagent';
import constants from '../constants/constants';

class adminAction {

    login(password) {
        var self = this;
        request
            .post(constants.apiroot + 'login')
            .send({password: password})
            .end(function (err, res) {
                if (res.status === 200) {
                    self.actions.loggedIn(res.body.token);
                } else {
                    console.log(err);
                    self.actions.unsuccessfulLogin();
                }
            });
    }

    logout(token) {
        var self = this;
        request
            .del(constants.apiroot + 'logout/' + token)
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res) {
                if (res.status === 200) {
                    self.actions.loggedOut();
                } else {
                    console.log(err);
                }
            });
    }

    loggedIn(token) {
        this.dispatch(token);
    }

    loggedOut() {
        this.dispatch();
    }

    unsuccessfulLogin() {
        this.dispatch();
    }
}

export default alt.createActions(adminAction);
