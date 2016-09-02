var metalsmith = require("metalsmith");
var ignore = require("metalsmith-ignore");
var minifyCss = require("metalsmith-myth");
var minifyJs = require("./plugins/uglify.js");

var config = require("./config.js");

metalsmith(config.folder.root)
	.clean(config.folder.cleanup)
	.source(config.folder.assets)
	.destination(config.folder.public)
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
