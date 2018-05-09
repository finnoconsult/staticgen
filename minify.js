var crypto = require('crypto');
var metalsmith = require("metalsmith");
var ignore = require("metalsmith-ignore");
var minifyCss = require("metalsmith-myth");
// https://www.npmjs.com/package/metalsmith-browserify
var browserify = require("metalsmith-browserify");
var minifyJs = require("./plugins/uglify.js");
var assign = require("./plugins/assign.js");

var config = require("./config.js");

var fileExistsService = require("./helper/file/fileExistsService");

const filesToBrowserify = (config.toBrowserify || []);

function metalsmithBuild(entries) {
  // TODO: make optional, at least for the second minification on the content
  const browserifiedFilesPlugin = entries.length >0 ?
  	browserify({
  		"entries": entries,
  		"browserifyOptions": {
  			"ignoreMissing": true,
  		},
  	}) :
  	assign({
  		"browserifiedFiles": 0
  	});

  // console.log('browserifying entries:', entries, browserifiedFilesPlugin);

  metalsmith(config.folder.root)
  	.clean(config.folder.cleanup)
  	.source(config.folder.assets)
  	.destination(config.folder.public)
  	.use(browserifiedFilesPlugin)
  	.use(ignore([
  		"img/*.max.*"
  	]))
  	.use(minifyJs())
  	.use(minifyCss({
  		files: "**/*.css",
  		compress: true
  	}))
  	.build(function (err) {
  		console.log(err || ((config.folder.cleanup ? "CleanUp & " : "") + "Asset preparation successful."));
  	});
}

fileExistsService(config.folder.assets, filesToBrowserify, metalsmithBuild);
