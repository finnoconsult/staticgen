var metalsmith = require("metalsmith");
var ignore = require("metalsmith-ignore");
var minifyCss = require("metalsmith-myth");
var minifyJs = require("./plugins/uglify.js");
var propagateLocale = require("./plugins/propagate-locale.js");
var permalinkLocale = require("./plugins/permalink-locale.js");
var modifyJson = require("./plugins/modify-json.js");

var config = require("./config.js");

metalsmith(__dirname)
	.source("assets")
	.destination("public")
	.use(ignore([
		"img/*.max.*"
	]))
	.use(propagateLocale({
		files: ["manifest.json"],
		locales: config.locales
	}))
	.use(permalinkLocale({
		files: ["manifest_*.json"],
		default: config.defaultLocale
	}))
	.use(modifyJson({
		default: config.defaultLocale
	}))
	.use(minifyJs())
	.use(minifyCss({
		files: "**/*.css",
		compress: true
	}))
	.build(function (err) {
		console.log(err || "Asset preparation successful.");
	});
