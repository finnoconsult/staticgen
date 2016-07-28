var metalsmith = require("metalsmith");
var contentParser = require("metalsmith-jade");
var layouts = require("metalsmith-layouts");
var inlineSource = require("./plugins/inline-source.js");
var assign = require("./plugins/assign.js");
var trueName = require("./plugins/truename.js");

var pkg = require("./package.json");

metalsmith(__dirname)
	.clean(false)
	.source("content")
	.destination("public")
	.use(assign({
		locale: require("./assets/manifest.json").lang,
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
	.use(inlineSource({
		source: "public",
		attribute: "data-inline",
		compress: false
	}))
	.build(function (err) {
		console.log(err || "Build successful.");
	});
