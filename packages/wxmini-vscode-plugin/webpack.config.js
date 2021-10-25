/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
'use strict';

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const path = require('path');

/** @type WebpackConfig */
const extensionConfig = {
  mode: 'none',
  target: 'node',
  entry: {
    extension: './src/extension.ts'
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, './dist'),
    libraryTarget: 'commonjs'
  },
  resolve: {
    mainFields: ['module', 'main'],
    extensions: ['.ts', '.js'], // support ts-files and js-files
    alias: {
      // provides alternate implementation for node module and source files
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'raw-loader'
          }
        ]
      }
    ]
  },
  plugins: [],
  externals: {
    vscode: 'commonjs vscode', // ignored because it doesn't exist
    "miniprogram-ci": "commonjs miniprogram-ci"
  },
  performance: {
    hints: false
  },
  devtool: 'nosources-source-map' // create a source map that points to the original source file
};

module.exports = [extensionConfig];
