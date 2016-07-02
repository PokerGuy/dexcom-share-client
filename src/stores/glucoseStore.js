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
        state.data = true;
        this.setState(state);
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

export default alt.createStore(ImmutableStore(GlucoseStore));
