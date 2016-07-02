import alt from '../lib/AltInstance';
import Immutable   from 'immutable';
import AltInstance from 'lib/AltInstance';
import request from 'superagent';
import constants from '../constants/constants';

class GlucoseActions {

    doInit() {
        var self = this;
        request
            .get(constants.apiroot)
            .end(function (err, res) {
                if (res.status === 200) {
                    self.actions.initialized(res.body);
                } else {
                    console.log(err);
                }
            });
    }

    initialized(res) {
        res.status = 'CONNECTED';
        this.dispatch(res);
    }

    update(newState) {
        this.dispatch(newState);
    }

}

export default alt.createActions(GlucoseActions);
