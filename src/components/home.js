import React                    from 'react';
import {RouteHandler, Link} from 'react-router';
import 'styles/bootstrap.css';
import 'styles/clean-blog.css';
import CleanBlogJS from 'lib/clean-blog';
import glucoseActions from '../actions/glucoseAction';
import glucoseStore from '../stores/glucoseStore';
import trend from './trend';
import _ from 'lodash';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        glucoseStore.listen(this.onChange.bind(this));
        this.decrementTime = this.decrementTime.bind(this);
        this.calcTime = this.calcTime.bind(this);
        var gState = glucoseStore.getState();
        if (gState.lastEntry) {
            gState.next = this.calcTime(gState.lastEntry);
            gState.timer = true;
            window.timer = setInterval(this.decrementTime, 1000);
        } else {
            gState.timer = false;
        }
        this.setState(gState);
    }

    componentWillUnmount() {
        clearInterval(window.timer);
        glucoseStore.unlisten(this.onChange);
    }

    calcTime(lastEntry) {
        var now = new Date().getTime();
        var last = new Date(lastEntry).getTime();
        var next = last + (60 * 1000 * 6); // 60 seconds, 1000 milliseconds per seconds, and anticipating in 6 minutes after the last call
        var until = next - now;
        if (until < 0) {
            until = 30 * 1000;
        }
        return until;
    }

    onChange(event) {
        var newState = glucoseStore.getState();
        newState.timer = this.state.timer;
        newState.next = this.calcTime(newState.lastEntry);
        if (newState.status == 'DISCONNECTED' && this.state.timer == true) {
            clearInterval(window.timer);
            newState.timer = false;
        }
        if (newState.status == 'CONNECTED' && this.state.timer == false) {
            newState.timer = true;
            window.timer = setInterval(this.decrementTime, 1000);
        }
        this.setState(newState);
    }

    decrementTime() {
        var state = this.state;
        state.next = state.next - 1000;
        this.setState(state);
    }

    render() {
        var glucose = 'Not available';
        if (this.state.glucose) {
            glucose = this.state.glucose;
        }
        var currentTrend = 'Not available';
        if (this.state.trend) {
            currentTrend = trend.trendsToText(this.state.trend);
        }
        var lastReading = 'Not Available';
        if (this.state.lastEntry) {
            var last = new Date(this.state.lastEntry);
            var ampm = 'AM';
            if (last.getHours() == 0) {
                lastReading = '12:';
            } else if (last.getHours() == 12) {
                lastReading = '12:';
                ampm = 'PM'
            } else if (last.getHours() > 12) {
                lastReading = last.getHours() - 12 + ':';
                ampm = 'PM';
            } else {
                lastReading = last.getHours() + ':';
            }
            if (last.getMinutes() < 10) {
                lastReading += '0' + last.getMinutes();
            } else {
                lastReading += last.getMinutes();
            }
            if (last.getSeconds() < 10) {
                lastReading += ':0' + last.getSeconds();
            } else {
                lastReading += ':' + last.getSeconds();
            }
            lastReading += ' ' + ampm;
        }
        var nextCall = 'Not Available';
        if (this.state.next) {
            var trunc = (this.state.next / 1000).toString().split(".");
            var seconds = parseInt(trunc[0]);
            var minutes = (seconds / 60).toString().split(".");
            var strMinutes = parseInt(minutes[0]);
            var strSeconds = seconds % 60;
            if (strSeconds < 10) {
                strSeconds = '0' + strSeconds;
            }
            nextCall = strMinutes + ':' + strSeconds;
            if (this.state.next < 0) {
                nextCall = 'Any second now...';
            }
        }
        if (this.state.status == 'DISCONNECTED') {
            nextCall = 'Disconnected';
        }
        var noData = <div></div>;
        if (this.state.data != true) {
            noData = <div className="alert alert-danger">Not getting any data from Dexcom</div>;
        }
        return (
            <div className="offset-top">
                <div className="col-sm-12">
                    {noData}
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">Current Status</h3>
                        </div>
                        <div className="panel-body">
                            <div className="text-left col-sm-12">Current Reading: {glucose}</div>
                            <div className="text-left col-sm-12">Direction: {currentTrend}</div>
                            <div className="text-left col-sm-12">Last Reading: {lastReading}</div>
                            <div className="text-left col-sm-12">Next Reading: {nextCall}</div>
                        </div>
                    </div>
                </div>
                <div className="offset-bottom">&nbsp;</div>
            </div>
        );
    }
}

export default Main;
