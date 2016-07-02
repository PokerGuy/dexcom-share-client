'use strict';

require('bootstrap/less/bootstrap.less');

import React    from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory, hashHistory} from 'react-router';
import routes from './routes';


ReactDOM.render(<Router history={hashHistory}>{routes}</Router>, document.getElementById('todo-list'))
