const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const nodeExternals = require('webpack-node-externals');

exports.chainWebpack = (webpackConfig) => {
  // Check for SSR mode
  if (!process.env.SSR || process.env.SSR === '0') return;

  webpackConfig
    .entry('app')
    .clear()
    .add('./src/main.server.js')

  webpackConfig.target('node');
  webpackConfig.output.libraryTarget('commonjs2')

  webpackConfig
    .plugin('WebpackManifestPlugin')
    .use(new WebpackManifestPlugin({
      fileName: 'ssr-manifest.json',
    }))

  webpackConfig.externals(nodeExternals({
    allowlist: [/\.(css|vue)$/]
  }))

  webpackConfig.optimization.splitChunks(false).minimize(false)

  webpackConfig.plugins.delete('hmr');
  webpackConfig.plugins.delete('preload')
  webpackConfig.plugins.delete('prefetch')
  webpackConfig.plugins.delete('progress')
  // webpackConfig.plugins.delete('friendly-errors')

  // for debugging purposes
  // console.log(webpackConfig.toConfig());
}
