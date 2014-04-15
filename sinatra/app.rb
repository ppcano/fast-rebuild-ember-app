
require 'sinatra'
require 'sinatra/base'
require "sinatra/reloader"

include ERB::Util

class App < Sinatra::Base

  set :public_dir, 'public'

  configure :development do
    register Sinatra::Reloader
  end

  get '/*' do
    erb :index
  end

end
#set :erubis, :escape_html => true

