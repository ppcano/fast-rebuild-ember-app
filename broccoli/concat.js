var BroccoliWriter = require('broccoli-writer')
var walkSync = require('walk-sync')
var fs = require('fs')


// TODO: accept array of Trees or individuals
module.exports = Filter
Filter.prototype = Object.create(BroccoliWriter.prototype)
Filter.prototype.constructor = Filter

function Filter(inputTree, options) {
  if (!(this instanceof Filter)) return new Filter(inputTree, options)
  this.inputTree = inputTree
  this.output = options
}

Filter.prototype.write = function (readTree, destDir) {

  var output = destDir+'/'+this.output;
  return readTree(this.inputTree).then(function (srcDir) {

    var inputFiles = walkSync(srcDir)
    for (var i = 0; i < inputFiles.length; i++) {

      var inputFile = inputFiles[i]

      var destPath = destDir + '/' + inputFile
      var srcPath = srcDir + '/' + inputFile

      if (fs.lstatSync(srcPath).isFile()) { 
        var content = fs.readFileSync(srcPath)
        fs.appendFileSync(output, content)
      }
    }

  })

}
