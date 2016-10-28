import alt from '../lib/AltInstance';
import GlucoseActions from '../actions/glucoseAction';
import ImmutableStore from 'alt/utils/ImmutableUtil';
import constants from '../constants/constants';

class GlucoseStore {
    constructor() {
        this.disconnected = this.disconnected.bind(this);
        this.connected = this.connected.bind(this);
        this.nodata = this.nodata.bind(this);
        this.bindListeners({
            initialized: GlucoseActions.initialized,
            update: GlucoseActions.update
        });
        this.state = {};
        var self = this;
        var source = new EventSource(constants.apiroot + 'update');
        source.addEventListener('update', function(e) {
            var j = JSON.parse(e.data);
            j.status = 'CONNECTED';
            GlucoseActions.update(j);
        }, false);
        source.addEventListener('synch', function(e) {
            GlucoseActions.doInit();
        }, false);
        source.addEventListener('open', function(e) {
            self.connected();
        }, false);
        source.addEventListener('nodata', function(e) {
            self.nodata();
        }, false);
        source.onerror = function(e) {
            console.log(e);
            if (source.readyState == 0) {
                self.disconnected();
            }
        }
    }

    initialized(state) {
        state.data = true;
        this.setState(state);
    }

    update(state) {
        var currState = this.state;
        currState.data = true;
        if (currState.history) {
            var history = currState.history;
            history = _.sortBy(history, 'time').reverse().map(function(g) {
                var unixTime = new Date(g.time).getTime();
                if (unixTime > (Date.now() - (1000 * 60 * 60 * 3))) {
                    return g;
                }
            });
            currState.glucose = state.glucose;
            history.unshift({time: state.lastEntry, glucose: state.glucose});
            currState.history = history;
            currState.lastEntry = state.lastEntry;
            currState.next = state.next;
            currState.trend = state.trend;
        }
        this.setState(currState);
    }

    disconnected() {
        console.log('disconnected');
        var state = this.state;
        state.status = 'DISCONNECTED';
        this.setState(state);
    }

    connected() {
        console.log('connected');
        var state = this.state;
        state.status = 'CONNECTED';
        this.setState(state);
    }

    nodata() {
        var state = this.state;
        state.data = false;
        this.setState(state);
    }
}

export default alt.createStore(ImmutableStore(GlucoseStore), 'GlucoseStore');
