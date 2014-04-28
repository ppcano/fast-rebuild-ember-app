var mergeTrees = require('broccoli-merge-trees'),
    es6Filter = require('./broccoli/es6'),
    defeatureifyFilter = require('./broccoli/defeatureify'),
    fs = require('fs'),
    replace = require('./broccoli/replace'),
    wrapFiles = require('broccoli-wrap'),
    match = require('./broccoli/match'),
    precompiler = require('./broccoli/precompiler').Filter,
    createPrecompilerModule = require('./broccoli/precompiler').CreatePrecompilerModule,
    selfExecuting = require('./broccoli/self_executing'),
    emberTemplateCompiler = require('./broccoli/ember_template_compiler'),
    append = require('./broccoli/append'),
    concatFilter = require('./broccoli/concat'),
    moveFile = require('broccoli-file-mover'),
    pickFiles = require('broccoli-static-compiler');

var runningTest = process.env.RUNNING_TEST === 'true';


// This file creation is only done at the design process
// so live-reloading do not work
var compilerInput = 'app/submodules/ember.js/packages_es6/ember-handlebars-compiler/lib/main.js';
var compilerOutput = 'tmp/ember-handlebars-compiler.js';
emberTemplateCompiler(compilerInput, compilerOutput);

// setup precompiler
handlebarsPath = "app/vendor/handlebars-v1.3.0.js";
precompiler.prototype.module = createPrecompilerModule(compilerOutput, handlebarsPath);


// pickFiles
var app = match('app', 'app/**/*.js');
var emberResolver = match('app', 'submodules/ember-jj-abrams-resolver/packages/*/lib/core.js');
var emberAmdLibs = match('app', 'submodules/ember.js/packages_es6/*/lib/**/*.amd.js');
var emberLibs = match('app', 'submodules/ember.js/packages/{rsvp,metamorph}/lib/main.js');
var emberModules = match('app', 'submodules/ember.js/packages_es6/*/lib/**/!(*.amd).js');//https://github.com/isaacs/node-glob/issues/62
var handlebarsRuntime = match('app', 'vendor/handlebars.runtime-v1.3.0.js');
var jquery = match('app', 'vendor/jquery-1.9.1.js');
var templates = match('app', 'templates/**/*.handlebars');


//var emberMain = match('app', 'submodules/ember.js/packages/ember/lib/main.js');
var emberMain = match('app', 'shims/ember.js');


var es6Options = function(filePath) {
                    return filePath.replace('app/app', 'app')
                                   .replace('app/submodules/ember.js/packages/','')
                                   .replace('app/submodules/ember.js/packages_es6/','')
                                   .replace('lib/','')
                                   .replace(/.js$/, '')
                                   .replace(/\/main$/, '');
                  };




// templates
templates = precompiler(templates, {templateNameGenerator: function(filePath) {
  return filePath.replace('app/templates/','')
                 .replace(/\.[^/.]+$/, "");
}});
templates = concatFilter(templates, 'templates.js');

templates = append(templates, {before: true, content: "import Ember from \"ember-metal/core\";\n import \"ember\";"});
templates = es6Filter(templates, 'app/templates');

// emberModules
                                  
emberModules = es6Filter(emberModules, es6Options);

//var features = match('.', 'ember_features.json'); // if a tree is passed, auto-rebuild whenever the file change
var defeatureifyOptions = JSON.parse(fs.readFileSync('ember_features.json', 'utf8'));

emberModules = defeatureifyFilter(emberModules, {options: defeatureifyOptions});
emberModules = precompiler(emberModules);

// emberMain
//emberMain = es6Filter(emberMain, es6Options);

// handlebarsRuntime
handlebarsRuntime = append(handlebarsRuntime, {before: false, content: "\nwindow.Handlebars = Handlebars\n"});
handlebarsRuntime = selfExecuting(handlebarsRuntime);

// app
app = es6Filter(app, es6Options);

// compose and build app.js
var trees = [app, emberResolver, emberAmdLibs, emberLibs, emberMain, emberModules, handlebarsRuntime, jquery, templates];

// ember-qunit

if ( runningTest ) {

  var emberQunit = match('app', 'submodules/ember-qunit/lib/**/*.js');
  emberQunit = es6Filter(emberQunit, { compatFix: true, 
                                       moduleGenerator: function(filePath) {
                                         return filePath.replace('app/submodules/', '')
                                           .replace('lib/','')
                                           .replace(/.js$/, '');
                                           //.replace(/\/main$/, '');  #issue: https://github.com/rpflorence/ember-qunit/issues/42 
                                   }  
  });

  //var emberQunit = match('app', 'submodules/ember-qunit/dist/named-amd/*.js');
  //emberQunit = replace(emberQunit, { match: /\"ember-qunit\"/g, replacement: "\"ember-qunit\/main\"" } );

  trees.push(emberQunit);

  var testsUtils = match('app', 'tests/lib/**/*.js');
  testsUtils = es6Filter(testsUtils, function(filePath) {
                                         return filePath.replace('app/tests/', '')
                                           .replace('lib/','')
                                           .replace(/.js$/, '')
                                           .replace(/\/main$/, '');  
                                     });

  trees.push(testsUtils);

  var emberTests = match('app', 'tests/tests/**/*_test.js');
  emberTests = concatFilter(emberTests, 'tests.js');

}
trees = new mergeTrees(trees)
trees = concatFilter(trees, 'app.js');
trees = selfExecuting(trees);
trees = append(trees, {before: true, path: "app/submodules/ember.js/packages/loader/lib/main.js"});


var publicFiles;

if ( runningTest ) {

  publicFiles = pickFiles('app', {
    srcDir: '/tests',
    destDir: '/' });

  trees = [publicFiles, trees, emberTests];

} else {

  publicFiles = pickFiles('broccoli_public', {
    srcDir: '/',
    destDir: '/' });

  trees = [publicFiles, trees]
}

trees = new mergeTrees(trees)
module.exports = trees;
