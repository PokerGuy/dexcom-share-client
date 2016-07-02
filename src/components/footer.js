import React from 'react';
import {RouteHandler, Link} from 'react-router';

class Footer extends React.Component {
    render() {
        return (
            <div className="navbar navbar-inverse navbar-fixed-bottom">
                <div className="row">
                        <p className="copyright text-muted">Copyright &copy; thezlotnicks 2016</p>
                </div>
            </div>
        );
    }
}

export default Footer;
