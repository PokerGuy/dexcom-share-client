import React                    from 'react';
import {RouteHandler, Link} from 'react-router';
import 'styles/bootstrap.css';
import 'styles/clean-blog.css';
import CleanBlogJS from 'lib/clean-blog';
import glucoseActions from '../actions/glucoseAction';
import glucoseStore from '../stores/glucoseStore';
import trend from './trend';

class Main extends React.Component {

    render() {
        return (
            <div className="offset-top">
                <div className="col-sm-12">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">Working demo from the Austin Tech Blogger</h3>
                        </div>
                        <div className="panel-body">
                            <div className="text-left col-sm-12">
                                This is a working demo coming from the blog and code samples at <a href="http://austintechblogger.blogspot.com">The Austin
                            Tech Blogger</a>. This is for demonstration and teaching purposes only.
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
