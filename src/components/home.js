import React                    from 'react';
import {RouteHandler, Link} from 'react-router';
import glucoseActions from '../actions/glucoseAction';
import glucoseStore from '../stores/glucoseStore';
import trend from './trend';
import _ from 'lodash';
import moment from 'moment-timezone';
import m from 'moment';
import GlucoseChart from './glucoseChart';
import NextReading from './timer';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {};
    }

    componentDidMount() {
        glucoseStore.listen(this.onChange);
        var gState = glucoseStore.getState();
        var history = gState.glucose;
        if (history) {
            if (history.length > 0) {
                history = _.sortBy(history, 'time').reverse();
                gState.glucose = history[0].glucose;
                gState.history = history;
            }
        }

        this.setState(gState);
    }

    componentWillUnmount() {
        clearInterval(window.timer);
        glucoseStore.unlisten(this.onChange);
    }

    onChange(event) {
        var newState = glucoseStore.getState();
        this.setState(newState);
    }

    render() {
        var glucose = 'Not available';
        var sorted;
        if (this.state.glucose) {
            if (this.state.glucose == 401) {
                glucose = 'HIGH';
            } else {
                glucose = this.state.glucose;
            }
        }
        var currentTrend = 'Not available';
        if (this.state.trend) {
            currentTrend = trend.trendsToText(this.state.trend);
        }
        var lastReading = 'Not Available';
        if (this.state.lastEntry) {
            var tz;
            if (localStorage.tz == undefined) {
                tz = 'America/Chicago';
            } else {
                tz = localStorage.tz;
            }
            var last = new Date(this.state.lastEntry);
            last = moment(last);
            last.tz(tz);
            var ampm = 'AM';
            if (last.get('hours') == 0) {
                lastReading = '12:';
            } else if (last.get('hours') == 12) {
                lastReading = '12:';
                ampm = 'PM'
            } else if (last.get('hours') > 12) {
                lastReading = last.getHours() - 12 + ':';
                ampm = 'PM';
            } else {
                lastReading = last.get('hours') + ':';
            }
            if (last.get('minutes') < 10) {
                lastReading += '0' + last.get('minutes');
            } else {
                lastReading += last.get('minutes');
            }
            if (last.get('seconds') < 10) {
                lastReading += ':0' + last.get('seconds');
            } else {
                lastReading += ':' + last.get('seconds');
            }
            lastReading += ' ' + ampm;
        }

        var noData = <div></div>;
        if (this.state.data != true) {
            noData = <div className="alert alert-danger">Not getting any data from Dexcom</div>;
        }
        var displayReading = '<div class="text-center col-sm-12">Current Reading: ' + glucose + '&nbsp;' + currentTrend + '</div>';

        return (
            <div className="offset-top">
                <div className="col-12">
                    {noData}
                    <div className="panel-body">
                        <div className="row">
                            <div dangerouslySetInnerHTML={{__html: displayReading}}/>
                        </div>
                        <div className="row">
                            <div className="text-center col-sm-12">Last Reading: {lastReading}
                                <NextReading status={this.state.status} lastEntry={this.state.lastEntry}/>
                            </div>
                        </div>
                    </div>
                    <GlucoseChart history={this.state.history}/>
                </div>
                <div className="offset-bottom">&nbsp;</div>
            </div>
        );
    }
}

export default Main;
