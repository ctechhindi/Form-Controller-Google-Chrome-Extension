'use strict';

const _ = require('lodash');
const fs = require('fs');
// https://github.com/babel/minify/tree/master/packages/babel-minify
const minify = require("babel-minify");
// https://github.com/jprichardson/node-fs-extra
const fse = require('fs-extra')

class JavascriptFilesInject {

  constructor(options) {
    this.options = _.assign({}, {
      scriptFile: false,
      templateFile: false,
      outputFile: false,
      // replaceString: "injection_script",
      minify: true,
      minifyJS: false, // No Inject Another file only single file minify
    }, options);
  }

  apply(compiler) {
    compiler.hooks.emit.tap('JavascriptFilesInject', (params) => {

      if (this.options.scriptFile === false) {
        throw new TypeError('set options.scriptFile file path.');
      }

      if (this.options.outputFile === false) {
        throw new TypeError('set options.outputFile file path.');
      }

      // Script Full Path
      var scriptFilePath = compiler.context + '/' + this.options.scriptFile;
      // Read Script File
      var scriptFileContent = fs.readFileSync(scriptFilePath, 'utf8');
      // Minify Script File Source
      if (this.options.minify === true) {
        var scriptFileMinify = minify(scriptFileContent, {
          mangle: {
            keepClassName: true
          }
        });
      }

      // Only JS Single File Minify
      if (this.options.minifyJS === true) {
        // Output Js File Path
        var outputFilePath = this.options.outputFile;
        if (this.options.minify === true) {
          var outputSource = scriptFileMinify.code;
        } else {
          var outputSource = scriptFileContent;
        }
        fse.outputFile(outputFilePath, outputSource, function (err) {
          if (err) {
            console.error("apply -> err", err)
          } else {
            console.log("--------------------------------------------");
            console.log("The file " + outputFilePath + " has been compiled.");
            console.log("--------------------------------------------\n");
          }
        });
      } else {

        if (this.options.templateFile === false) {
          throw new TypeError('set options.templateFile file path.');
        }

        // Template File Full Path
        var templateFilePath = compiler.context + '/' + this.options.templateFile;
        var templateFileContent = fs.readFileSync(templateFilePath, 'utf8');

        // Replace a string in a file
        if (this.options.minify === true) {
          var replaceJsContent = templateFileContent.replace(/injection_script/g, "`" + scriptFileMinify.code + "`");
        } else {
          var replaceJsContent = templateFileContent.replace(/injection_script/g, "`" + scriptFileContent + "`");
        }

        // Minify Script File Source
        if (this.options.minify === true) {
          var templateFileMinify = minify(replaceJsContent, {
            mangle: {
              keepClassName: true
            }
          });
        }

        // Output Js File Path
        var outputFilePath = this.options.outputFile;
        if (this.options.minify === true) {
          var outputSource = templateFileMinify.code;
        } else {
          var outputSource = replaceJsContent;
        }
        fse.outputFile(outputFilePath, outputSource, function (err) {
          if (err) {
            console.error("apply -> err", err)
          } else {
            console.log("--------------------------------------------");
            console.log("The file " + outputFilePath + " has been compiled.");
            console.log("--------------------------------------------\n");
          }
        });
      }

    });
  }
}

module.exports = JavascriptFilesInject;