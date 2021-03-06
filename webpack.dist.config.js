/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

'use strict';

var webpack = require('webpack');

module.exports = {

    output: {
        publicPath: '/assets/',
        path: 'dist/assets/',
        filename: 'main.js'
    },

    debug: false,
    devtool: false,
    entry: './src/app.js',

    stats: {
        colors: true,
        reasons: false
    },

    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
	new webpack.DefinePlugin({
    			'process.env': {
      			'NODE_ENV': JSON.stringify('production')
    		}
  	}),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ],

    resolve: {
        extensions: ['', '.js'],
        alias: {
            'styles': __dirname + '/src/styles',
            'mixins': __dirname + '/src/mixins',
            'components': __dirname + '/src/components/',
            'stores': __dirname + '/src/stores',
            'actions': __dirname + '/src/actions',
            'lib': __dirname + '/src/lib',
            'fonts': __dirname + '/src/fonts'
        }
    },

    module: {
        preLoaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'jsxhint'
        }],

        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.less/,
            loader: 'style-loader!css-loader!less-loader'
        }, {
            test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/
            , loader: 'file-loader'
        }, {
            include: /\.json$/,
            loader: 'json-loader'}]

    }
};
