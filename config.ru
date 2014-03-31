
require 'sinatra'
require './app'

$stdout.sync = true


env = ENV['RACK_ENV']

if env.nil? || env.empty? || env == 'development'

	require 'rake-pipeline'
	require 'rake-pipeline/middleware'
	use Rake::Pipeline::Middleware, Rake::Pipeline::Project.new("Assetfile")

end


run App.new
