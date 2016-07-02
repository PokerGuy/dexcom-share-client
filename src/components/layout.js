import React                    from 'react';
import Router from 'react-router';
import Bootstrap from 'styles/bootstrap.css';
import CleanBlog from 'styles/clean-blog.css';
import 'lib/clean-blog';
import Header from './header';
import Footer from './footer';



class Layout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Header />
                {this.props.children}
                <Footer />
            </div>
        );
    }
}

export default Layout;
