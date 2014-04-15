PORT ?= 8000
server:

	rm -rf tmp/* public/*
	RACK_ENV=development bundle exec rackup config.ru -p $(PORT)

serve:
	
	broccoli serve --port 9000

build:
	
	rm -rf dist
	broccoli build dist

.PHONY: server build
