# Fast Rebuil Ember App Structure

Ember app project structure running "partial/fast" rebuilds with [Broccoli](https://github.com/joliss/broccoli) and
[Rake::Pipeline](https://github.com/livingsocial/rake-pipeline)


# Setup

Ember packages are included as git submodules (providing easier debugging), you must initialize and update submodules.

```sh
git submodule update --init
```



# Setup and run broccoli live reloading

- npm install
- broccoli serve

> see Brocfile.js and [broccoli folder](https://github.com/ppcano/fast-rebuild-ember-app/tree/master/broccoli).


# Setup and run sinatra app with rake pipeline

- bundle install
- make server

> check Assetfile.rb and [rakep
folder](https://github.com/ppcano/fast-rebuild-ember-app/tree/master/rakep).
