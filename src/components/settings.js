import React                    from 'react';
import {RouteHandler, Link} from 'react-router';
import moment from 'moment-timezone';
import _ from 'lodash';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.first = this.first.bind(this);
        this.second = this.second.bind(this);
        this.third = this.third.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        var sorted = _.sortBy(moment.tz.names(), function (name) {
            return name;
        });
        var filter = [];
        _.each(sorted, function (name) {
            var f = name.split('/')[0];
            if (filter.indexOf(f) == -1) {
                filter.push(f);
            }
        });
        var first = null;
        var second = null;
        var third = null;
        if (localStorage.tz != null) {
            var split = localStorage.tz.split('/');
            first = split[0];
            if (split[1] != undefined) {
                second = split[1];
                if (split[2] != undefined) {
                    third = split[2];
                }
            }
        } else {
            first = 'America';
            second = 'Chicago';
        }
        this.setState({
            firstChoice: filter,
            secondChoice: [],
            thirdChoice: [],
            first: first,
            second: second,
            third: third
        }, function() {
            if (second != null) {
                var dummy = {target: {value: first, reset: false}};
                var self = this;
                this.first(dummy, function() {
                    if (third != null) {
                        dummy = {target: {value: second, reset: false}};
                        self.second(dummy);
                    }
                });
            }
        });
    }

    first(e, cb) {
        var copy = this.state;
        copy.first = e.target.value;
        if (e.target.reset != false) {
            copy.second = null;
            copy.third = null;
        }
        var sc = [];
        _.each(moment.tz.names(), function (name) {
            var elem = name.split('/');
            if (copy.first == elem[0] && elem.length > 1 && sc.indexOf(elem[1]) == -1) {
                sc.push(elem[1]);
            }
        });
        copy.secondChoice = sc;
        copy.thirdChoice = [];
        this.setState(copy, function() {
            if (cb != undefined) {
                cb();
            }
        });
    }

    second(e) {
        var copy = this.state;
        copy.second = e.target.value;
        if (e.target.reset != false) {
            copy.third = null;
        }
        var tc = [];
        _.each(moment.tz.names(), function (name) {
            var elem = name.split('/');
            if (copy.first == elem[0] && elem.length > 2 && copy.second == elem[1] && tc.indexOf(elem[2]) == -1) {
                tc.push(elem[2]);
            }
        });
        copy.thirdChoice = tc;
        this.setState(copy);
    }

    third(e) {
        var copy = this.state;
        copy.third = e.target.value;
        this.setState(copy);
    }

    save(e) {
        e.preventDefault();
        if (this.state.thirdChoice.length > 0 && this.state.third != null) {
            localStorage.tz = this.state.first + '/' + this.state.second + '/' + this.state.third;
            $.notify('Region settings set.', {type: 'success'});
            this.props.history.push('/');
        } else if (this.state.secondChoice.length > 0 && this.state.second != null && this.state.thirdChoice.length == 0) {
            localStorage.tz = this.state.first + '/' + this.state.second;
            $.notify('Region settings set.', {type: 'success'});
            this.props.history.push('/');
        } else if (this.state.first != null && this.state.secondChoice.legnth == 0) {
            localStorage.tz = this.state.first;
            $.notify('Region settings set.', {type: 'success'});
            this.props.history.push('/');
        } else {
            $.notify('Not able to set regions, make sure all selected boxes have a value', {type: 'danger'});
        }
    }


    render() {
        var first = ' ';
        var second = ' ';
        if (this.state) {
            if (this.state.first == null) {
                first = <select value=" " name="region1" onChange={this.first}>
                    <option value=" ">&nbsp;</option>
                    {_.map(this.state.firstChoice, function (val, i) {
                        return (
                            <option value={val} key={i}>{val}</option>
                        )
                    })}
                </select>
            } else {
                first = <select value={this.state.first} name="region1" onChange={this.first}>
                    {_.map(this.state.firstChoice, function (val, i) {
                        return (
                            <option value={val} key={i}>{val}</option>
                        )
                    })}
                </select>
            }
            if (this.state.secondChoice.length > 0) {
                if (this.state.second == null) {
                    second =
                        <div>
                            <fieldset className="form-group col-sm-12">
                                <label htmlFor="region2">Sub Region:</label>
                            </fieldset>
                            <fieldset className="form-group col-sm-12">
                                <select value=" " name="region2" onChange={this.second}>
                                    <option value=" ">&nbsp;</option>
                                    {_.map(this.state.secondChoice, function (val, i) {
                                        return (
                                            <option value={val} key={i}>{val}</option>
                                        )
                                    })}
                                </select>
                            </fieldset>
                        </div>
                } else {
                    second =
                        <div>
                            <fieldset className="form-group col-sm-12">
                                <label htmlFor="region2">Sub Region:</label>
                            </fieldset>
                            <fieldset className="form-group col-sm-12">
                                <select value={this.state.second} name="region2" onChange={this.second}>
                                    {_.map(this.state.secondChoice, function (val, i) {
                                        return (
                                            <option value={val} key={i}>{val}</option>
                                        )
                                    })}
                                </select>
                            </fieldset>
                        </div>
                }
            }
            var third = ' ';
            if (this.state.thirdChoice.length > 0) {
                if (this.state.third == null) {
                    third =
                        <div>
                            <fieldset className="form-group col-sm-12">
                                <label htmlFor="region2">Sub Sub Region:</label>
                            </fieldset>
                            <fieldset className="form-group col-sm-12">
                                <select value=" " name="region3" onChange={this.third}>
                                    <option value=" ">&nbsp;</option>
                                    {_.map(this.state.thirdChoice, function (val, i) {
                                        return (
                                            <option value={val} key={i}>{val}</option>
                                        )
                                    })}
                                </select>
                            </fieldset>
                        </div>
                } else {
                    third =
                        <div>
                            <fieldset className="form-group col-sm-12">
                                <label htmlFor="region2">Sub Sub Region:</label>
                            </fieldset>
                            <fieldset className="form-group col-sm-12">
                                <select value={this.state.third} name="region2" onChange={this.third}>
                                    {_.map(this.state.thirdChoice, function (val, i) {
                                        return (
                                            <option value={val} key={i}>{val}</option>
                                        )
                                    })}
                                </select>
                            </fieldset>
                        </div>
                }
            }
        }
        return (
            <div className="offset-top">
                <div className="col-sm-12">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">Settings</h3>
                        </div>
                        <div className="panel-body">
                            <div className="text-left col-sm-12">
                                <form>
                                    <fieldset className="form-group col-sm-12">
                                        <label htmlFor="region1">Region:</label>
                                    </fieldset>
                                    <fieldset className="form-group col-sm-12">
                                        {first}
                                    </fieldset>
                                    {second}
                                    {third}
                                    <button className="btn btn-success" onClick={this.save}>Submit</button>
                                    <Link to="/">
                                        <button className="btn btn-danger">Cancel</button>
                                    </Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="offset-bottom">&nbsp;</div>
            </div>
        );
    }
}

export default Main;
