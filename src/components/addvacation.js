import React                    from 'react';
import {RouteHandler, Link, browserHistory} from 'react-router';
import adminStore from '../stores/adminStore';
import adminAction from '../actions/adminAction';
import DatePicker from 'react-bootstrap-date-picker';
import moment from 'moment-timezone';
import request from 'superagent';
import constants from '../constants/constants';
import _ from 'lodash';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.setStart = this.setStart.bind(this);
        this.setEnd = this.setEnd.bind(this);
        this.setName = this.setName.bind(this);
        this.submit = this.submit.bind(this);
        this.state = {
            errors: [],
            name: '',
            start: null,
            end: null
        }
    }

    setStart(value) {
        var currState = this.state;
        currState.start = value;
        this.setState(currState);
    }

    setEnd(value) {
        var currState = this.state;
        currState.end = value;
        this.setState(currState);
    }

    setName(e) {
        var currState = this.state;
        currState.name = e.target.value;
        this.setState(currState);
    }

    submit(e) {
        e.preventDefault();
        var token = adminStore.getState().token;
        var self = this;
        var tz;
        if (localStorage.tz == undefined) {
            tz = 'America/Chicago';
        } else {
            tz = localStorage.tz;
        }
        request
            .post(constants.apiroot + 'vacation')
            .set('Authorization', 'Bearer ' + token)
            .set('Content-type', 'application/json')
            .send({startDate: moment.tz(this.state.start, tz).format('MM/DD/YYYY'), endDate: moment.tz(this.state.end, tz).format('MM/DD/YYYY'), name: this.state.name})
            .end(function (err, res) {
                if (res.status == 401) {
                    var currState = self.state;
                    currState.errors = ['You are not logged in.'];
                    self.setState(currState);
                } else if (res.body.errors) {
                    var currState = self.state;
                    currState.errors = res.body.errors;
                    self.setState(currState);
                } else {
                    //happy path
                    self.props.history.push('/vacation');
                }
            });
    }

    render() {
        var errors = <div></div>;
        if (this.state.errors.length > 0) {
            errors = <div className="alert alert-danger">
                <ul>
                {_.map(this.state.errors, function (e, i) {
                    return (
                        <li key={i}>{e}</li>
                    )
                })}
                    </ul>
                </div>;
        }
        return (
            <div className="offset-top">
                <div className="col-sm-12">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">Add a Vacation Period</h3>
                        </div>
                        <div className="panel-body">
                            <div className="text-left col-sm-12">
                                {errors}
                                <form>
                                    <fieldset className="form-group col-sm-12">
                                        <label htmlFor="vacationname">Vacation Period Name:</label>
                                        <input type="text" className="form-control" onChange={this.setName}
                                               value={this.state.name}/>
                                    </fieldset>
                                    <fieldset className="form-group col-sm-6">
                                        <label>Start Date:</label>
                                        <DatePicker value={this.state.start} onChange={this.setStart}/>
                                    </fieldset>
                                    <fieldset className="form-group col-sm-6">
                                        <label>End Date:</label>
                                        <DatePicker value={this.state.end} onChange={this.setEnd}/>
                                    </fieldset>
                                    <button className="btn btn-success" onClick={this.submit}>Submit</button>
                                    <Link to="vacation">
                                        <button className="btn btn-danger">Cancel</button>
                                    </Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="offset-bottom">&nbsp;</div>
            </div>
        )
    }
}

export
default
Main;
