import alt from '../lib/AltInstance';
import uuid from 'node-uuid';
import followerStore from '../stores/followerStore';
import Immutable   from 'immutable';
import AltInstance from 'lib/AltInstance';
import request from 'superagent';
import constants from '../constants/constants';

class followerAction {
    setPhone(e) {
        var phone;
        if (e.target.value.length === 3) {
            phone = "(" + e.target.value + ") ";
        } else if (e.target.value.length === 9) {
            phone = e.target.value + "-";
        } else {
            phone = e.target.value;
        }
        this.dispatch(phone);
    }

    setName(e) {
        this.dispatch(e.target.value);
    }

    handleBackspace(e) {
        if (e.keyCode === 8) {
            var phone;
            if (e.target.value.length === 11 || e.target.value.length === 10) {
                //Get rid of the dash
                phone = e.target.value.substring(0, 9);
                this.dispatch(phone);
            } else if (e.target.value.length === 7 || e.target.value.length === 6) {
                phone = e.target.value.substring(1, 4);
                this.dispatch(phone);
            }
        }
    }

    setExpiration(value) {
        this.dispatch(value);
    }

    toggle() {
        this.dispatch();
    }

    submit(e) {
        e.preventDefault();
        this.dispatch();
    }

    addTimeBand(e) {
        e.preventDefault();
        this.dispatch(uuid.v4());
    }

    deleteTimeBand(id) {
        this.dispatch(id);
    }

    onChange(id, name, hour) {
        this.dispatch({id: id, name: name, hour: hour});
    }

    timeBandSelected(id) {
        this.dispatch(id);
    }

    addEvent(id) {
        this.dispatch(id);
    }

    removeEvent(eventid) {
        this.dispatch(eventid);
    }

    eventChange(eventId, name, value) {
        this.dispatch({eventId: eventId, name: name, value: value});
    }
}

export default alt.createActions(followerAction);
