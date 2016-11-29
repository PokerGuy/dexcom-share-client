import React                    from 'react';
import {RouteHandler, Link, browserHistory} from 'react-router';
import adminStore from '../stores/adminStore';
import 'styles/bootstrap.css';
import 'styles/clean-blog.css';
import adminAction from '../actions/adminAction';
import _ from 'lodash';
import moment from 'moment-timezone';
import { BootstrapPager, GriddleBootstrap } from 'griddle-react-bootstrap';
import CleanBlogJS from 'lib/clean-blog';
import request from 'superagent';
import '../../node_modules/griddle-react-bootstrap/dist/griddle-react-bootstrap.css'
import constants from '../constants/constants';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = adminStore.getState();
    }

    componentDidMount() {
        adminStore.listen(this.onChange);
    }

    componentWillUnmount() {
        adminStore.unlisten(this.onChange);
    }

    onChange(event) {
        this.setState(event);
    }

    render() {
        var formatted = _.map(this.state.followers, function (f) {
            var e = moment.tz(f.expirationDate, 'America/Chicago').format('MM/DD/YYYY');
            var p = f.phoneNumber.toString();
            var phone = "(" + p.substring(0, 3) + ") " + p.substring(3, 6) + "-" + p.substring(6, 10);
            return ({"Name": f._id, "Phone Number": phone, "Expiration Date": e, "Delete": f._id});
        });
        var columnMeta = [
            {
                "columnName": "Name",
                "order": 1,
                "locked": false,
                "visible": true,
                "customComponent": FollowerSelect
            },
            {
                "columnName": "Phone Number",
                "order": 2,
                "locked": false,
                "visible": true
            },
            {
                "columnName": "Expiration Date",
                "order": 3,
                "locked": false,
                "visible": true
            },
            {
                "columnName": "Delete",
                "order": 4,
                "locked": false,
                "visible": true,
                "customComponent": DeleteButton
            }
        ];
        return (
            <div className="offset-top">
                <div className="col-sm-12">
                    <div className="row">
                        <Link to="addvacation">
                            <button className="btn btn-primary">Add a Follower</button>
                        </Link>
                    </div>
                    <div className="row">
                        &nbsp;
                    </div>
                    <div className="row">
                        <GriddleBootstrap
                            tableClassName={'table table-bordered table-striped table-hover'}
                            columnMetadata={columnMeta}
                            useGriddleStyles={false}
                            results={formatted}
                            showFilter={true}
                            showSettings={false}
                            useCustomPagerComponent={true}
                            customPagerComponent={ BootstrapPager }
                        />
                    </div>
                    <Timeband followerId={this.state.selectedFollower}/>
                </div>
                <div className="offset-bottom">&nbsp;</div>
            </div>
        );
    }
}

class FollowerSelect extends React.Component {
    constructor(props) {
        super(props);
        this.click = this.click.bind(this);
    }

    click(e) {
        e.preventDefault();
        adminAction.selectFollower(this.props.data);
    }

    render() {
        var name = _.find(adminStore.getState().followers, {_id: this.props.data});
        return (
            <div>
                <div className="text-left">
                    {name.name}
                </div>
                <div className="text-right">
                    <a href="#" onClick={this.click}>(See Details)</a>
                </div>
            </div>
        )
    }
}

class DeleteButton extends React.Component {
    constructor(props) {
        super(props);
        this.click = this.click.bind(this);
    }

    click() {
        var token = adminStore.getState().token;
        request
            .del(constants.apiroot + 'vacation/' + this.props.data)
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res) {
                if (res.status === 200) {
                    console.log(res.body);
                } else {
                    console.log(err);
                }
            });
    }

    render() {
        return (
            <div className="text-center">
                <button className="btn btn-danger" onClick={this.click}>Delete</button>
            </div>
        )
    }
}

class Timeband extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var formatting = function (hours, minutes) {
            if (minutes.toString().length == 1) {
                minutes = "0" + minutes;
            }
            if (hours == 0) {
                return "12" + ":" + minutes + " AM";
            } else if (hours < 11) {
                return hours + ":" + minutes + " AM";
            } else {
                hours = hours - 12;
                return hours + ":" + minutes + " PM";
            }
        };
        if (this.props.followerId == undefined) {
            return (
                <div></div>
            )
        } else {
            var selected = this.props.followerId;
            var name = _.find(adminStore.getState().followers, {_id: selected});
            var formatted = [];
            return (
                <div>
                    <div className="row">
                        Time Bands for {name.name}:
                    </div>
                    <div className="row">
                        <table className="table table-bordered table-striped table-hover">
                            <thead>
                            <tr>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>&nbsp;</th>
                            </tr>
                            </thead>
                            <tbody>
                            {name.timeBand.map(function (tb) {
                                return (
                                    <tr>
                                        <td>{formatting(tb.startHour, tb.startMinute)}</td>
                                        <td>{formatting(tb.endHour, tb.endMinute)}</td>
                                        <td>Placeholder</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        }
    }
}

export default Main;
