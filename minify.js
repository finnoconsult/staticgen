var crypto = require('crypto');
var metalsmith = require("metalsmith");
var ignore = require("metalsmith-ignore");
var minifyCss = require("metalsmith-myth");
// https://www.npmjs.com/package/metalsmith-browserify
var browserify = require("metalsmith-browserify");
var minifyJs = require("./plugins/uglify.js");
// var fileExists = require('file-exists');
var assign = require("./plugins/assign.js");

var config = require("./config.js");

// var toBundle = [
// 	"js/crypto.js",
// ];
// var bundling = [];
//
// toBundle.filter(file => {console.log(`tODO: ${config.folder.assets}/${file} is exists?`); return false});
//
//
//
// bundling.push['a'];
// console.log('ex?', fileExists(`${config.folder.assets}/js/crypto.js`).then(exists => {if (exists)bundling.push['ok'];console.log('exists!', exists)}));
// bundling.push['c'];
// async console.log('bundling', bundling);


metalsmith(config.folder.root)
	.clean(config.folder.cleanup)
	.source(config.folder.assets)
	.destination(config.folder.public)
	// .use(null)
	.use(browserify({
		// TODO: make optional?, at least for the second minification on the content
		"entries": ["js/crypto.js"],
		"browserifyOptions": {
				// "ignoreMissing": true,
    },
	}))
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
