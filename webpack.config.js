const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        content: path.join(__dirname, 'src/content.tsx'),
        background: path.join(__dirname, 'src/background.ts')
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: '[name].js',
    },
    devtool: 'source-map',
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            {
                loader: "source-map-loader",
                test: /\.js$/,
                enforce: "pre" },
            {
                loader: "awesome-typescript-loader",
                test: /\.tsx?$/,
                exclude: /node_modules/
            },
            {
                test: /\.s(a|c)ss$/,
                use: [{
                    loader: 'style-loader', // inject CSS to page
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS modules
                }, {
                    loader: 'sass-loader' // compiles SASS to CSS
                }]
            }
        ]
    },
    plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
        //,new UglifyJSPlugin()
    ]
};