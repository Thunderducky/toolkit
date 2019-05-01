const path = require('path')

module.exports = {
    mode: 'development',
    entry: './client/src/js/app.js',
    output: {
        path: path.resolve(__dirname, 'client/public'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { // JS RULES
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            { // STYLE RULES
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader' // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader' // translates CSS into CommonJS
                    },
                    {
                        loader: 'sass-loader' // compiles Sass to CSS
                    }
                ]
            }
        ]
    },
    stats: 'errors-only'
}
