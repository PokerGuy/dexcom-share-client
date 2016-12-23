import React                    from 'react';
import {RouteHandler, Link} from 'react-router';
import trend from './trend';

class Main extends React.Component {

    render() {
        return (
            <div className="offset-top">
                <div className="col-sm-12">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">DISCLAIMERr</h3>
                        </div>
                        <div className="panel-body">
                            <div className="text-left col-sm-12">
                                All information, thought, and code described here is intended for informational and educational purposes only.
                                I currently make no attempt at HIPAA privacy compliance. Use of this code is without warranty or support of any kind.
                                Use at your own risk, and do not use the information or code to make medical decisions.
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
