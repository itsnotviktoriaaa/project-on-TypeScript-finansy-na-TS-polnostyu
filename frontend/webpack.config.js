const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/app.ts',
    devtool: 'inline-source-map',
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: {
        static: '.dist',
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                { from: "templates", to: "templates" },
                { from: "css", to: "css" },
                { from: "images", to: "images" },
                { from: "fonts", to: "fonts" },
                // { from: "node_modules/bootstrap/dist/js/bootstrap.min.js", to: "bootstrap" },
            ],
        }),
    ],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};