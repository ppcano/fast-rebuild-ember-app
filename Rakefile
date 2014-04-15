require 'bundler/setup'
#require 'ember-dev/tasks'
require 'zlib'
require 'fileutils'
require 'pathname'
require 'json'
require 'rake-pipeline'

def pipeline
  Rake::Pipeline::Project.new("Assetfile")
end

desc "Build pipeline"
task :build do
  pipeline.invoke
end

desc "Clean build artifacts from previous builds"
task :clean do
  pipeline.clean
end

