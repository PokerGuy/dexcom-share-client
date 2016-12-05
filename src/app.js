'use strict';

import 'bootstrap/less/bootstrap.less';
import 'styles/clean-blog.css';
import 'styles/font-awesome.css';
import Bootstrap from 'lib/bootstrap';
import CleanBlogJS from 'lib/clean-blog';
import React    from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory, hashHistory} from 'react-router';
import routes from './routes';


ReactDOM.render(<Router history={hashHistory}>{routes}</Router>, document.getElementById('todo-list'))
