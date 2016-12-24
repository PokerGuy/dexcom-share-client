import React                    from 'react';
import {RouteHandler, Link, browserHistory} from 'react-router';
import adminStore from '../stores/adminStore';
import adminAction from '../actions/adminAction';
import _ from 'lodash';
import moment from 'moment-timezone';
import { BootstrapPager, GriddleBootstrap } from 'griddle-react-bootstrap';
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
        var tz;
        if (localStorage.tz == undefined) {
            tz = 'America/Chicago';
        } else {
            tz = localStorage.tz;
        }
        var formatted = _.map(this.state.vacation, function (v) {
            var s = moment.tz(v.startDate, tz).format('MM/DD/YYYY');
            var e = moment.tz(v.endDate, tz).format('MM/DD/YYYY');
            return ({"Name": v.name, "Start Date": s, "End Date": e, "Delete": v._id});
        });
        var columnMeta = [
            {
                "columnName": "Name",
                "order": 1,
                "locked": false,
                "visible": true
            },
            {
                "columnName": "Start Date",
                "order": 2,
                "locked": false,
                "visible": true
            },
            {
                "columnName": "End Date",
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
                            <button className="btn btn-primary">Add a Vacation Period</button>
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
                </div>
                <div className="offset-bottom">&nbsp;</div>
            </div>
        );
    }
}

class DeleteButton extends React.Component {
    constructor(props) {
        super(props);
        this.click = this.click.bind(this);
    }

    click(e) {
        e.preventDefault();
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
                <a href="#" onClick={this.click}>DELETE</a>
            </div>
        )
    }
}

export default Main;
