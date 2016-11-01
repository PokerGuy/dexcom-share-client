import React                    from 'react';
import {RouteHandler, Link} from 'react-router';
import 'styles/bootstrap.css';
import 'styles/clean-blog.css';
import CleanBlogJS from 'lib/clean-blog';
import glucoseActions from '../actions/glucoseAction';
import glucoseStore from '../stores/glucoseStore';
import trend from './trend';
import _ from 'lodash';
import moment from 'moment-timezone';
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
            var currentT = trend.trendsToText(this.state.trend);
			currentTrend = <div dangerouslySetInnerHTML={{ __html: {currentT}}}></div>;
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

        var noData = <div></div>;
        if (this.state.data != true) {
            noData = <div className="alert alert-danger">Not getting any data from Dexcom</div>;
        }

        return (
            <div className="offset-top">
                <div className="col-12">
                    {noData}
                    <div className="panel-body">
                        <div className="row">
                            <div className="text-center col-sm-12">Current Reading: {glucose} &nbsp;
                                Direction: {currentTrend}</div>
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
