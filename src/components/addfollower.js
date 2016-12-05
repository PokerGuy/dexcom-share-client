import React                    from 'react';
import {RouteHandler, Link, browserHistory} from 'react-router';
import adminStore from '../stores/adminStore';
import followerStore from '../stores/followerStore';
import followerAction from '../actions/followerAction';
import DatePicker from 'react-bootstrap-date-picker';
import moment from 'moment-timezone';
import request from 'superagent';
import constants from '../constants/constants';
import uuid from 'node-uuid';
import _ from 'lodash';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = followerStore.getState();
    }

    componentDidMount() {
        followerStore.listen(this.onChange);
    }

    componentWillUnmount() {
        followerStore.unlisten(this.onChange);
    }

    onChange(event) {
        if ('complete' in event) {
            this.props.history.push('/followers')
        } else {
            this.setState(event);
        }
    }

    render() {
        if ('complete' in this.state) {
            this.props.history.push('/followers')
        }
        var timeBand = <div></div>;
        var errors = <div></div>;
        if (this.state.errors != null) {
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
        if (this.state.selectedTimeBand != null) {
            timeBand = <Events timeBandid={this.state.selectedTimeBand} />;
        }
        return (
            <div className="offset-top">
                <div className="col-sm-12">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">Add a Follower</h3>
                        </div>
                        <div className="panel-body">
                            <div className="text-left col-sm-12">
                                {errors}
                                <form>
                                    <fieldset className="form-group col-sm-12">
                                        <label htmlFor="vacationname">Name:</label>
                                        <input type="text" className="form-control" onChange={followerAction.setName} />
                                    </fieldset>
                                    <fieldset className="form-group col-sm-6">
                                        <label>Phone Number:</label>
                                        <input type="tel" value={this.state.phone} onChange={followerAction.setPhone}
                                               onKeyDown={followerAction.handleBackspace}
                                               className="form-control"/>
                                    </fieldset>
                                    <fieldset className="form-group col-sm-6">
                                        <label>Expiration Date (blank defaults to never expire):</label>
                                        <DatePicker value={this.state.expirationDate}
                                                    onChange={followerAction.setExpiration}/>
                                    </fieldset>
                                    <fieldset className="form-group col-sm-12">
                                        <label>
                                            <input type="checkbox" value={this.state.includeWeekends} checked={this.state.includeWeekends} onChange={followerAction.toggle} />
                                            &nbsp;&nbsp;Include Weekends and Holidays
                                        </label>
                                    </fieldset>
                                    <label htmlFor="timebands">Time Bands: </label>
                                    <br/>
                                    <a href="#" onClick={followerAction.addTimeBand}>Add Time Band</a>
                                    <table className="table table-bordered table-striped table-hover">
                                        <thead>
                                        <tr>
                                            <th>&nbsp;</th>
                                            <th>Start Hour</th>
                                            <th>Start Minute</th>
                                            <th>AM/PM</th>
                                            <th>End Hour</th>
                                            <th>End Minute</th>
                                            <th>AM/PM</th>
                                            <th>&nbsp;</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.timeBand.map(function (t) {
                                            return (
                                                <TimeBand key={t.id} id={t.id} startHour={t.startHour}
                                                          startMinute={t.startMinute} startAMPM={t.startAMPM}
                                                          endHour={t.endHour} endMinute={t.endMinute}
                                                          endAMPM={t.endAMPM}/>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                    <br/>
                                    {timeBand}
                                    <br/>
                                    <button className="btn btn-success" onClick={followerAction.submit}>Submit</button>
                                    <Link to="followers">
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

class TimeBand extends React.Component {
    constructor(props) {
        super(props);
        this.deleteTimeBand = this.deleteTimeBand.bind(this);
        this.onChange = this.onChange.bind(this);
        this.addEvents = this.addEvents.bind(this);
    }

    deleteTimeBand(e) {
        e.preventDefault();
        followerAction.deleteTimeBand(this.props.id);
    }

    onChange(e) {
        followerAction.onChange(this.props.id, e.target.name, e.target.value);
    }

    addEvents(e) {
        e.preventDefault();
        followerAction.timeBandSelected(this.props.id);
    }

    render() {
        var hours = [];
        hours.push(" ");
        for (var i = 1; i <= 12; i++) {
            hours.push(i);
        }
        var minutes = [];
        minutes.push(" ");
        for (var i = 0; i <= 55; i+=5) {
            minutes.push(i);
        }
        var inhStartHour = 15;
        if ('startHour' in this.props) {
            inhStartHour = this.props.startHour;
        }
        var startHour;
        if (inhStartHour != 15) {
            startHour = <select value={inhStartHour} onChange={this.onChange} name="startHour">{hours.map(function (h) {
                return (
                    <option key={uuid.v4()} value={h}>{h}</option>
                )
            })
            }
            </select>
        } else {
            startHour = <select value=" " onChange={this.onHourChange} name="startHour">
                {hours.map(function(h) {
                    <option key={uuid.v4()} value={h}>{h}</option>
                })}
            </select>
        }
        var inhEndHour = 15;
        if ('endHour' in this.props) {
            inhEndHour = this.props.endHour;
        }
        var endHour;
        if (inhEndHour != 15) {
            endHour = <select value={inhEndHour} onChange={this.onChange} name="endHour">{hours.map(function (h) {
                return (
                    <option key={uuid.v4()} value={h}>{h}</option>
                )
            })
            }
            </select>
        } else {
            endHour = <select value=" " onChange={this.onChange} name="endHour">
                {hours.map(function(h) {
                    <option key={uuid.v4()} value={h}>{h}</option>
                })}
            </select>
        }
        var inhStartMinute = 100;
        if ('startMinute' in this.props) {
            inhStartMinute = this.props.startMinute;
        }
        var startMinute;
        if (inhStartMinute != 100) {
            startMinute = <select value={inhStartMinute} onChange={this.onChange} name="startMinute">{minutes.map(function (m) {
                return (
                    <option key={uuid.v4()} value={m}>{m}</option>
                )
            })
            }
            </select>
        } else {
            startMinute = <select value=" " onChange={this.onChange} name="startMinute">
                {minutes.map(function(m) {
                    <option key={uuid.v4()} value={m}>{m}</option>
                })}
            </select>
        }


        var inhEndMinute = 100;
        if ('endMinute' in this.props) {
            inhEndMinute = this.props.endMinute;
        }
        var endMinute;
        if (inhEndMinute != 100) {
            endMinute = <select value={inhEndMinute} onChange={this.onChange} name="endMinute">{minutes.map(function (m) {
                return (
                    <option key={uuid.v4()} value={m}>{m}</option>
                )
            })
            }
            </select>
        } else {
            endMinute = <select value=" " onChange={this.onChange} name="endMinute">
                {minutes.map(function(m) {
                    <option key={uuid.v4()} value={m}>{m}</option>
                })}
            </select>
        }

        var startAMPM;
        if (this.props.startAMPM != undefined) {
            startAMPM = <select value={this.props.startAMPM} name="startAMPM" onChange={this.onChange}>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
        } else {
            startAMPM = <select value=" " name="startAMPM" onChange={this.onChange}>
                <option value=" "></option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
        }


        var endAMPM;
        if (this.props.endAMPM != undefined) {
            endAMPM = <select value={this.props.endAMPM} name="endAMPM" onChange={this.onChange}>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
        } else {
            endAMPM = <select value=" " name="endAMPM" onChange={this.onChange}>
                <option value=" "></option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
        }
        var events = <div></div>;
        if (this.props.startHour != undefined &&
            this.props.startMinute != undefined &&
            this.props.startAMPM != undefined &&
            this.props.endHour != undefined &&
            this.props.endMinute != undefined &&
            this.props.endAMPM != undefined) {
            events = <a href="#" onClick={this.addEvents}>ADD/DELETE EVENTS</a>;
        }

        return (
            <tr>
                <td><a href="#" onClick={this.deleteTimeBand}>DELETE</a></td>
                <td className="text-center">{startHour}</td>
                <td className="text-center">{startMinute}</td>
                <td className="text-center">{startAMPM}</td>
                <td className="text-center">{endHour}</td>
                <td className="text-center">{endMinute}</td>
                <td className="text-center">{endAMPM}</td>
                <td className="text-center">{events}</td>
            </tr>
        )
    }
}

class Events extends React.Component {
    constructor(props) {
        super(props);
        this.addEvent = this.addEvent.bind(this);
    }

    addEvent(e) {
        e.preventDefault();
        followerAction.addEvent(this.props.timeBandid);
    }

    render() {
        var selected = this.props.timeBandid;
        var formatTime = function(hour, minute, ampm) {
            if (minute.toString().length == 1) {
                minute = "0" + minute;
            }
            return hour + ":" + minute + " " + ampm;
        };
        var timeBand = _.filter(followerStore.getState().timeBand, function(t) {
            if (t.id == selected) {
                return t;
            }
        });
        var selectedTB = timeBand[0];
        return (
            <div>
                <label htmlFor="events">Events from {formatTime(selectedTB.startHour, selectedTB.startMinute, selectedTB.startAMPM)} to {formatTime(selectedTB.endHour, selectedTB.endMinute, selectedTB.endAMPM)} </label>
                <br/>
                <a href="#" onClick={this.addEvent}>Add Event</a>
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>Type</th>
                        <th>&nbsp;</th>
                        <th>Action</th>
                        <th>Repeat</th>
                    </tr>
                    </thead>
                    <tbody>
                    {selectedTB.event.map(function (e) {
                        return (
                            <Event key={e.id} id={e.id} type={e.type}
                                      glucose={e.glucose}
                                    action={e.action}
                                    repeat={e.repeat}
                            />
                        )
                    })}
                    </tbody>
                </table>
            </div>
        )
    }
}

class Event extends React.Component {
    constructor(props) {
        super(props);
        this.delete = this.delete.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    delete(e) {
        e.preventDefault();
        followerAction.removeEvent(this.props.id)
    }

    onChange(e) {
        followerAction.eventChange(this.props.id, e.target.name, e.target.value);
    }

    render() {
        var selectedType = " ";
        var types = [" ", "low", "high", "double up", "double down", "no data"];
        if (this.props.type != undefined) {
            selectedType = this.props.type;
        }
        var selectType = <select value={selectedType} name="type" onChange={this.onChange}>
            {types.map(function(t) {
            return (
                <option value={t} key={uuid.v4()}>{t}</option>
            )
        })}
        </select>;
        var glucose = <div></div>;
        if (this.props.type != undefined) {
            if (this.props.type == "low") {
                glucose = <div>If glucose is below <input name="glucose" type="tel" onChange={this.onChange} /> BG</div>;
            } else if (this.props.type == "high") {
                glucose = <div>If glucose is above <input name="glucose" type="tel" onChange={this.onChange} /> BG</div>;
            } else if (this.props.type == "no data") {
                glucose = <div>Take action after <input name="noDataTime" type="tel" onChange={this.onChange} /> minutes</div>;
            }
        }
        var actions = [" ", "call", "text", "call/text"];
        var selectedAction = " ";
        if (this.props.action != undefined) {
            selectedAction = this.props.action;
        }
        var action = <select value={selectedAction} name="action" onChange={this.onChange}>
            {actions.map(function(a) {
                return (
                    <option key={uuid.v4()} value={a}>{a}</option>
                )
            })
            }
        </select>;
        return(
            <tr>
                <td><a href="#" onClick={this.delete}>DELETE</a></td>
                <td className="text-center">{selectType}</td>
                <td>{glucose}</td>
                <td>{action}</td>
                <td>Repeat after <input type="tel" name="repeat" onChange={this.onChange} /> minutes</td>
            </tr>
        )
    }
}



export default Main;
