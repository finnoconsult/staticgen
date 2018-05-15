const crypto = require('crypto');
const metalsmith = require("metalsmith");
const ignore = require("metalsmith-ignore");
const minifyCss = require("metalsmith-myth");
// https://www.npmjs.com/package/metalsmith-browserify
const browserify = require("metalsmith-browserify");
const minifyJs = require("./plugins/uglify.js");
const assign = require("./plugins/assign.js");

const config = require("./config.js");

const fileExistsService = require("./helper/file/fileExistsService");

const filesToBrowserify = (config.toBrowserify || []);

function metalsmithBuild(entries) {
  // TODO: make optional, at least for the second minification on the content
  const browserifiedFilesPlugin = entries.length >0
    ? browserify({
  		"entries": entries,
  		"browserifyOptions": {
  			"ignoreMissing": true,
  		},
  	})
    : assign({
  		"browserifiedFiles": 0
  	});
    // console.log('browserifying entries:', entries, browserifiedFilesPlugin);

    const minifyJSPlugin = config.isProduction ? minifyJs() : assign({isDevelopment: true, isProduction: false});
    // console.log('minifyJSPlugin:', config.isProduction, config.isDevelopment, minifyJSPlugin);


  metalsmith(config.folder.root)
  	.clean(config.folder.cleanup)
  	.source(config.folder.assets)
  	.destination(config.folder.public)
  	.use(browserifiedFilesPlugin)
  	.use(ignore([
  		"img/*.max.*"
  	]))
  	.use(minifyJSPlugin)
  	.use(minifyCss({
  		files: "**/*.css",
  		compress: true
  	}))
  	.build(function (err) {
  		console.log(err || ((config.folder.cleanup ? "CleanUp & " : "") + "Asset preparation successful."));
  	});
}

fileExistsService(config.folder.assets, filesToBrowserify, metalsmithBuild);
