# crush-images-webpack-plugin
Webpack plugin that compresses image assets. Uses [compress-images](https://www.npmjs.com/package/compress-images) module.

## Usage

`
npm i crush-images-webpack-plugin
`

webpack.config.js
```js
const CrushImagesWebpackPlugin = require('crush-images-webpack-plugin');
[...]
plugins: [
  new CrushImagesWebpackPlugin({
    entry: './src/assets/**/*.*',
    output: 'assets/',
    quality: 75
  })
]
[...]
```
