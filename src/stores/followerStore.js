import alt from '../lib/AltInstance';
import followerAction from '../actions/followerAction';
import ImmutableStore from 'alt/utils/ImmutableUtil';
import uuid from 'node-uuid';
import moment from 'moment-timezone';
import adminStore from './adminStore';
import constants from '../constants/constants';
import notify from 'bootstrap-growl';
import request from 'superagent';
import _ from 'lodash';

class FollowerStore {
    constructor() {
        this.bindListeners({
            setPhone: followerAction.setPhone,
            handleBackspace: followerAction.handleBackspace,
            setExpiration: followerAction.setExpiration,
            submit: followerAction.submit,
            addTimeBand: followerAction.addTimeBand,
            deleteTimeBand: followerAction.deleteTimeBand,
            onChange: followerAction.onChange,
            timeBandSelected: followerAction.timeBandSelected,
            addEvent: followerAction.addEvent,
            removeEvent: followerAction.removeEvent,
            toggle: followerAction.toggle,
            eventChange: followerAction.eventChange,
            setName: followerAction.setName,
            init: followerAction.init
        });
        this.state = {phone: "", includeWeekends: true, timeBand: [{id: uuid.v4(), event: [{id: uuid.v4()}]}]};
    }

    setPhone(phone) {
        var currState = this.state;
        currState.phone = phone;
        this.setState(currState);
    }

    handleBackspace(phone) {
        var currState = this.state;
        currState.phone = phone;
        this.setState(currState);
    }

    setExpiration(date) {
        var currState = this.state;
        currState.expirationDate = date;
        this.setState(currState);
    }

    submit() {
        console.log('This is the state before prepping it');
        console.log(this.state);
        var token = adminStore.getState().token;
        var self = this;
        var phone = this.state.phone.substring(1, 4) + this.state.phone.substring(6, 9) + this.state.phone.substring(10, 14);
        var follower = {
            name: this.state.name,
            phoneNumber: phone,
            includeWeekendsAndHolidays: this.state.includeWeekends,
            timeBand: []
        };
        if ('expirationDate' in this.state) {
            follower.expirationDate = moment.tz(this.state.expirationDate, 'America/Chicago').format('MM/DD/YYYY')
        }
        _.each(this.state.timeBand, function (tb) {
            var fixTime = function (hour, ampm) {
                if (hour == 12 && ampm === "AM") {
                    return 0;
                } else if (ampm === "PM" && hour != 12) {
                    return parseInt(hour) + 12;
                } else {
                    return parseInt(hour);
                }
            };
            var timeband = {
                startHour: fixTime(tb.startHour, tb.startAMPM),
                startMinute: tb.startMinute,
                endHour: fixTime(tb.endHour, tb.endAMPM),
                endMinute: tb.endMinute,
                event: []
            };
            _.each(tb.event, function (e) {
                var event = {
                    type: e.type,
                    action: e.action,
                    repeat: e.repeat * 60 * 1000
                };
                if (e.type === "low" || e.type === "high") {
                    event.glucose = e.glucose;
                } else if (e.type === "no data") {
                    event.noDataTime = e.noDataTime * 60 * 1000;
                }
                timeband.event.push(event);
                console.log(event);
            });
            follower.timeBand.push(timeband);
            console.log(timeband);
        });
        console.log(follower);
        request
            .post(constants.apiroot + 'follower')
            .set('Authorization', 'Bearer ' + token)
            .set('Content-type', 'application/json')
            .send(follower)
            .end(function (err, res) {
                if (res.status == 401) {
                    var currState = self.state;
                    currState.errors = ['You are not logged in.'];
                    self.setState(currState);
                } else if (res.body.errors) {
                    console.log(res.body);
                    var currState = self.state;
                    currState.errors = res.body.errors;
                    self.setState(currState);
                } else {
                    //happy path
                    self.setState({complete: true});
                }
            });
    }

    addTimeBand(id) {
        var currState = this.state;
        currState.timeBand.push({id: id, event: [{id: uuid.v4()}]});
        this.setState(currState);
    }

    deleteTimeBand(id) {
        var currState = this.state;
        var timebands = currState.timeBand;
        timebands = _.filter(timebands, function (t) {
            if (t.id != id) {
                return t;
            }
        });
        currState.timeBand = timebands;
    }

    onChange(obj) {
        var currState = this.state;
        var timebands = currState.timeBand;
        timebands = _.map(timebands, function (t) {
            if (t.id != obj.id) {
                return t;
            } else {
                var newT = t;
                newT[obj.name] = obj.hour;
                return newT;
            }
        });
        currState.timeBand = timebands;
        this.setState(currState);
    }

    timeBandSelected(id) {
        console.log('in the store');
        var currState = this.state;
        currState.selectedTimeBand = id;
        this.setState(currState);
    }

    addEvent(id) {
        var currState = this.state;
        var tb = _.filter(currState.timeBand, function (t) {
            if (t.id == id) {
                return t;
            }
        });
        tb[0].event.push({id: uuid.v4()});
        var newTB = _.filter(currState.timeBand, function (t) {
            if (t.id == id) {
                return tb[0];
            } else {
                return t;
            }
        });
        currState.timeBand = newTB;
        this.setState(currState);
    }

    removeEvent(eventId) {
        var currState = this.state;
        var tb = _.map(currState.timeBand, function (t) {
            var e = _.filter(t.event, function (event) {
                if (event.id != eventId) {
                    return event;
                }
            });
            t.event = e;
            return t;
        });
        currState.timeBand = tb;
        this.setState(currState);
    }

    toggle() {
        var currState = this.state;
        if (currState.includeWeekends) {
            currState.includeWeekends = false;
        } else {
            currState.includeWeekends = true;
        }
        this.setState(currState);
    }

    eventChange(obj) {
        //this.dispatch({eventId: eventId, name: name, value: value});
        var currState = this.state;
        currState.timeBand = _.map(currState.timeBand, function(t) {
            t.event = _.map(t.event, function(evt) {
                if (evt.id != obj.eventId) {
                    return evt;
                } else {
                    var newE = evt;
                    newE[obj.name] = obj.value;
                    return newE;
                }
            });
            return t;
        });
        console.log(currState);
        this.setState(currState);
    }

    setName(name) {
        var currState = this.state;
        currState.name = name;
        this.setState(currState);
    }

    init() {
        this.setState({phone: "", includeWeekends: true, timeBand: [{id: uuid.v4(), event: [{id: uuid.v4()}]}]});
    }
}

export default alt.createStore(ImmutableStore(FollowerStore), 'FollowerStore');
