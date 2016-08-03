var metalsmith = require("metalsmith");
var contentParser = require("metalsmith-jade");
var layouts = require("metalsmith-layouts");
var i18n = require("metalsmith-i18n");
var propagateLocale = require("./plugins/propagate-locale.js");
var permalinkLocale = require("./plugins/permalink-locale.js");
var inlineSource = require("./plugins/inline-source.js");
var assign = require("./plugins/assign.js");
var trueName = require("./plugins/truename.js");
var basePath = require("./plugins/basepath.js");

var config = require("./config.js");
var absoluteUrl = config.domain === config.homepage ? "" : config.homepage;

metalsmith(__dirname)
	.clean(false)
	.source("content")
	.destination("public")
	.use(assign({
		linkTo: function (locale, path) { return absoluteUrl + (locale === config.defaultLocale ? "" : "/" + locale) + path; },
		homepage: config.homepage,
		countries: config.countries
	}))
	.use(trueName())
	.use(basePath())
	.use(propagateLocale({
		files: ["**/*.jade"],
		locales: config.locales
	}))
	.use(permalinkLocale({
		files: ["**/*.jade"],
		default: config.defaultLocale
	}))
	.use(i18n({
		default: config.defaultLocale,
		locales: config.locales,
		directory: "locales"
	}))
	.use(contentParser({
		useMetadata: true
	}))
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
