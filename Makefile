PORT ?= 8080
server:

	rm -rf tmp/* source/*
	RACK_ENV=development bundle exec rackup config.ru -p $(PORT)


.PHONY: server
