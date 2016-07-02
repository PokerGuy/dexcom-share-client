import React                    from 'react';
import {Router, Route} from 'react-router';
import Main from 'components/home';
import Layout from 'components/layout';
import About from 'components/about';

const routes = (
    <Route path="layout" component={Layout}>
        <Route name='main' path="/" component={Main}/>
        <Route name="about" path="/about" component={About} />
    </Route>
);

export default routes;
