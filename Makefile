PORT ?= 8000
server:

	rm -rf tmp/* public/*
	RACK_ENV=development bundle exec rackup config.ru -p $(PORT)

serve:
	
	rm -rf dist tmp
	RUNNING_TEST=false broccoli serve --port 9000 

test:
	
	rm -rf dist tmp
	RUNNING_TEST=true broccoli serve --port 9000 

build:
	
	rm -rf dist tmp
	broccoli build dist

.PHONY: server build
