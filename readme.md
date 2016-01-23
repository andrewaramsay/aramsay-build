# Simple Build

Simple Build is a convention over configuration, opinionated build tool for MEAN stack applications.  It handles all
the setup and necessary config to utilize various tools for an ideal workflow.  It is largely based on John Papa's
[Hottowel](https://github.com/johnpapa/generator-hottowel) project, this is just a bundled ready-to-use build tool that can simple be installed and referenced from
your local gulpfile.



# Tasks

* run:server - Starts the backend server (if applicable), and launches the client code in your browser.




# Misc Notes

* files injected into index.html w/ gulp-inject & wiredep, so no re-building is needed while editing existing files
	* **TODO** watch for new files and automatically re-fire `build:wiredep`
* automatic reloading using browsersync
* If backend server is running, automatically proxy specified routes (e.g. /api) to that server.  Back-end does
not need to host static client code.
* `build:bundle` process to generate `app.js` and `vendor.js` files and a special `index.html` to reference them.
	* **TODO** angular template-cache
	* **TODO** inject & bundle css



# TODO
* linting
	* custom eslint plugins & settings??
* plato? - what is this from hottowel?
* sass -> less
	* `build:wiredep` support to add compiled css to index.html
	* `build:bundle` support to bundle css
* fonts
	* `build:bundle` support to copy fonts to build
* images
	* `build:bundle` support to compress & copy images to build
* `build:bundle` call angular template-cache
	* also minify html?

* Testing - Do I need to support testing, or just leave that to the end user's gulpfile?   Yeah, especially client-testing
	* server specs, get to be configured, currently hard coded from my old gulpfile

* `build:bundle` overall add more optimizations (minification, etc)
	* gulp-rev and gulp-rev-replace
* *bump* task to bump version numbers
