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
        return (
            <div className="offset-top">
                <div className="col-sm-12">
                    <h3>Add a Follower</h3>
                    <div className="text-left col-sm-12">
                        {errors}
                        <form>
                            <fieldset className="form-group col-sm-12">
                                <label htmlFor="vacationname">Name:</label>
                                <input type="text" className="form-control" onChange={followerAction.setName}/>
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
                                    <input type="checkbox" value={this.state.includeWeekends}
                                           checked={this.state.includeWeekends} onChange={followerAction.toggle}/>
                                    &nbsp;&nbsp;Include Weekends and Holidays
                                </label>
                            </fieldset>
                            <br/>
                            <h6><a href="#" onClick={followerAction.addTimeBand}>ADD TIME BAND</a></h6>
                            {this.state.timeBand.map(function (t) {
                                return (
                                    <TimeBand key={t.id} id={t.id} startHour={t.startHour}
                                              startMinute={t.startMinute} startAMPM={t.startAMPM}
                                              endHour={t.endHour} endMinute={t.endMinute}
                                              endAMPM={t.endAMPM} event={t.event}/>
                                )
                            })}
                            <button className="btn btn-success" onClick={followerAction.submit}>Submit</button>
                            <Link to="followers">
                                <button className="btn btn-danger">Cancel</button>
                            </Link>
                        </form>
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
        this.addEvent = this.addEvent.bind(this);
    }

    deleteTimeBand(e) {
        e.preventDefault();
        followerAction.deleteTimeBand(this.props.id);
    }

    onChange(e) {
        followerAction.onChange(this.props.id, e.target.name, e.target.value);
    }

    addEvent(e) {
        e.preventDefault();
        followerAction.addEvent(this.props.id);
    }

    render() {
        var hours = [];
        hours.push(" ");
        for (var i = 1; i <= 12; i++) {
            hours.push(i);
        }
        var minutes = [];
        minutes.push(" ");
        for (var i = 0; i <= 55; i += 5) {
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
                {hours.map(function (h) {
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
                {hours.map(function (h) {
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
            startMinute =
                <select value={inhStartMinute} onChange={this.onChange} name="startMinute">{minutes.map(function (m) {
                    return (
                        <option key={uuid.v4()} value={m}>{m}</option>
                    )
                })
                }
                </select>
        } else {
            startMinute = <select value=" " onChange={this.onChange} name="startMinute">
                {minutes.map(function (m) {
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
            endMinute =
                <select value={inhEndMinute} onChange={this.onChange} name="endMinute">{minutes.map(function (m) {
                    return (
                        <option key={uuid.v4()} value={m}>{m}</option>
                    )
                })
                }
                </select>
        } else {
            endMinute = <select value=" " onChange={this.onChange} name="endMinute">
                {minutes.map(function (m) {
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

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Time Band</h3>
                </div>
                <div className="panel-body">
                    <fieldset className="form-group col-sm-2">
                        <label htmlFor="startHour">Start Hour:&nbsp;</label>
                        {startHour}
                    </fieldset>
                    <fieldset className="form-group col-sm-2">
                        <label htmlFor="startMinute">Start Minute:&nbsp;</label>
                        {startMinute}
                    </fieldset>
                    <fieldset className="form-group col-sm-2">
                        <label htmlFor="startAMPM">AM/PM&nbsp;</label>
                        {startAMPM}
                    </fieldset>
                    <fieldset className="form-group col-sm-2">
                        <label htmlFor="endHour">End Hour:&nbsp;</label>
                        {endHour}
                    </fieldset>
                    <fieldset className="form-group col-sm-2">
                        <label htmlFor="endMinute">End Minute:&nbsp;</label>
                        {endMinute}
                    </fieldset>
                    <fieldset className="form-group col-sm-2">
                        <label htmlFor="endAMPM">AM/PM:&nbsp;</label>
                        {endAMPM}
                    </fieldset>
                    <fieldset className="form-group col-sm-12">
                        <h6><a href="#" onClick={this.addEvent}>ADD EVENT</a></h6>
                    </fieldset>
                    {this.props.event.map(function (e) {
                        return (
                            <Event key={e.id} id={e.id} type={e.type}
                                   glucose={e.glucose}
                                   action={e.action}
                                   repeat={e.repeat}
                            />
                        )
                    })}
                </div>
                <div className="panel-footer">
                    <h6><a href="#" onClick={this.deleteTimeBand}>DELETE</a></h6>
                </div>
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
            {types.map(function (t) {
                return (
                    <option value={t} key={uuid.v4()}>{t}</option>
                )
            })}
        </select>;
        var glucose = <div></div>;
        if (this.props.type != undefined) {
            if (this.props.type == "low") {
                glucose = <div>If glucose is below <input name="glucose" type="tel" onChange={this.onChange}/> BG</div>;
            } else if (this.props.type == "high") {
                glucose = <div>If glucose is above <input name="glucose" type="tel" onChange={this.onChange}/> BG</div>;
            } else if (this.props.type == "no data") {
                glucose =
                    <div>Take action after <input name="noDataTime" type="tel" onChange={this.onChange}/> minutes</div>;
            }
        }
        var actions = [" ", "call", "text", "call/text"];
        var selectedAction = " ";
        if (this.props.action != undefined) {
            selectedAction = this.props.action;
        }
        var action = <select value={selectedAction} name="action" onChange={this.onChange}>
            {actions.map(function (a) {
                return (
                    <option key={uuid.v4()} value={a}>{a}</option>
                )
            })
            }
        </select>;
        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    <fieldset className="form-grouop col-sm-3">
                        <h6><a href="#" onClick={this.delete}>DELETE</a></h6>
                    </fieldset>
                    <fieldset className="form-group col-sm-2">
                        <label htmlFor="selectType">Event Type:&nbsp;</label>
                        {selectType}
                    </fieldset>
                    <fieldset className="form-group col-sm-3">
                        {glucose}
                    </fieldset>
                    <fieldset className="form-group col-sm-1">
                        <label htmlFor="action">Action:&nbsp;</label>
                        {action}
                    </fieldset>
                    <fieldset className="form-group col-sm-3">
                        <label htmlFor="repeat">Repeat After:&nbsp;</label>
                        <input type="tel" name="repeat" onChange={this.onChange}/> minutes
                    </fieldset>
                </div>
            </div>
        )
    }
}


export default Main;
