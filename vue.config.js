const CopyPlugin = require('copy-webpack-plugin');
const JavascriptFilesInject = require('./plugins/javascript-files-inject.js');

module.exports = {
  chainWebpack(webpackConfig) {
    webpackConfig.plugin('copy-manifest').tap(args => {
      args[0][0].force = true
      return args
    })
  },
  pages: {
    popup: {
      template: 'public/browser-extension.html',
      entry: './src/popup/main.js',
      title: 'Popup'
    },

    popup: {
      entry: './src/root-script/root-script.js',
    },

    options: {
      template: 'public/browser-extension.html',
      entry: './src/options/main.js',
      title: 'Options'
    },
    fieldAction: {
      template: 'public/browser-extension.html',
      entry: './src/fieldAction/main.js',
      title: 'Field Action'
    }
  },
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/background.js'
        },
        contentScripts: {
          entries: {
            'content-script': [
              'src/content-scripts/content-script.js'
            ]
          }
        }
      }
    }
  },
  configureWebpack: {
    plugins: [
      new CopyPlugin([
        { from: 'src/script', to: 'script'},
      ]),
      new JavascriptFilesInject({
        scriptFile: "src/root-script/root-script.js",
        templateFile: "src/root-script/root-template.src",
        outputFile: __dirname + '/dist/script/root.js',
        minify: true,
      }),
    ],
  }
}
