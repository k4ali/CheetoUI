const path = require('path');

module.exports = {
    mode: "production",
    entry: "./src/App.ts",
    output: {
        filename: "cheeto.js",
        path: path.resolve('./', "build")
    },
    module: {
        rules: [
            {
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    optimization: {
        minimize: true
    },
};