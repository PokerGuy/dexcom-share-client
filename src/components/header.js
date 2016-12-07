import React                    from 'react';
import {RouteHandler, Link} from 'react-router';
import adminAction from '../actions/adminAction';
import adminStore from '../stores/adminStore';

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.logOut = this.logOut.bind(this);
        this.state = {token: null};
    }

    componentDidMount() {
        adminStore.listen(this.onChange);
        this.setState(adminStore.getState());
    }

    componentWillUnmount() {
        adminStore.unlisten(this.onChange);
    }

    onChange(event) {
        this.setState(adminStore.getState());
    }

    logOut() {
        adminAction.logout(this.state.token);
    }

    render() {
        var login = <li><Link to="/login">Log In</Link></li>;
        var adminTasks = <li>&nbsp;</li>;
        if (this.state.token) {
            adminTasks = <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                   aria-expanded="false">Admin Tasks <span className="fa fa-caret-down"></span></a>
                <ul className="dropdown-menu">
                    <li><Link to="vacation">Vacation Schedule</Link></li>
                    <li><Link to="followers">Maintain Followers</Link></li>
                </ul>
            </li>;
            login = <li><a href="#" onClick={this.logOut}>Log Out</a></li>;
        }
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header page-scroll">
                        <button type="button" className="navbar-toggle" data-toggle="collapse"
                                data-target="#bs-example-navbar-collapse-1">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <Link to="/" className="navbar-brand">Glucose Trackinator</Link>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav navbar-right">
                            {adminTasks}
                            {login}
                            <li>
                                <Link to="/about">About</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Header;
