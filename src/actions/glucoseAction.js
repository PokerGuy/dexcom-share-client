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
        var history = res.glucose;
        if (history.length > 0) {
            history = _.sortBy(history, 'time').reverse().filter(function(g) {
                var unixTime = new Date(g.time).getTime();
                if (unixTime > (Date.now() - (1000 * 60 * 60 * 3))) {
                    return g;
                }
            });
            res.glucose = history[0].glucose;
            res.history = history;
        } else {
            res.glucose = null;
        }
        this.dispatch(res);
        //console.log(new Date(res.lastEntry).getTime());
}

    update(newState) {
        //newState has a new thing to add to history - no longer represents the new state...
        this.dispatch(newState);
    }

    catchUp(last) {
        //do something
    }
}

export default alt.createActions(GlucoseActions);
