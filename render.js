var metalsmith = require("metalsmith");
var assets = require("metalsmith-assets");
var contentParser = require("metalsmith-jade");
var layouts = require("metalsmith-layouts");
var assign = require("./plugins/assign.js");
var trueName = require("./plugins/truename.js");

var pkg = require("./package.json");

metalsmith(__dirname)
	.source("content")
	.destination("public")
	.use(assign({
		homepage: pkg.homepage
	}))
	.use(contentParser({
		useMetadata: true
	}))
	.use(trueName())
	.use(layouts({
		engine: "jade",
		default: "compact.jade",
		pattern: "**/*.html"
	}))
	.use(assets({
		source: "assets"
	}))
	.build(function (err) {
		console.log(err || "Build successful.");
	});
