var PickFiles = require('broccoli-static-compiler');


module.exports = Filter
Filter.prototype = Object.create(PickFiles.prototype)
Filter.prototype.constructor = Filter

function Filter(tree, match) {
  
  // If tree is empty, liveReload fails and `failed to stat` warning
  if (!(this instanceof Filter)) return new Filter(tree, match)
  this.inputTree = tree
  this.options = {
    srcDir: '/',
    files: [match],
    destDir: tree
  }
}
