var metalsmith = require("metalsmith");
var ignore = require("metalsmith-ignore");
var minifyCss = require("metalsmith-myth");
var minifyJs = require("./plugins/uglify.js");

var pkg = require("./package.json");

metalsmith(__dirname)
	.source("assets")
	.destination("public")
	.use(ignore([
		"img/icon-*.svg",
		"img/*.max.*"
	]))
	.use(minifyJs())
	.use(minifyCss({
		files: "**/*.css",
		compress: true
	}))
	.build(function (err) {
		console.log(err || "Asset preparation successful.");
	});
