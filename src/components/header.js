import React                    from 'react';
import {RouteHandler, Link} from 'react-router';
import '../styles/bootstrap.css';
import '../styles/clean-blog.css';
import Bootstrap from '../lib/bootstrap';
import CleanBlogJS from '../lib/clean-blog';

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.changeState = this.changeState.bind(this);
        this.state = {};
    }

    componentDidMount() {

    }

    changeState(state) {

    }

    onChange(event) {
        this.changeState(event);
    }

    render() {
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
                        <Link to="/" className="navbar-brand">Dexcom Messaging System</Link>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <Link to="about">About</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Header;
