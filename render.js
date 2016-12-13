var metalsmith = require("metalsmith");
var contentParserJade = require("metalsmith-jade");
var contentParserMarkdown = require("metalsmith-markdown");
var layouts = require("metalsmith-layouts");
var i18n = require("metalsmith-i18n");
var propagateLocale = require("./plugins/propagate-locale.js");
var permalinkLocale = require("./plugins/permalink-locale.js");
var modify = require("./plugins/modify.js");
var inlineSource = require("./plugins/inline-source.js");
var assign = require("./plugins/assign.js");
var trueName = require("./plugins/truename.js");
var canonical = require("./plugins/canonical.js");

var config = require("./config.js");

metalsmith(config.folder.root)
	.clean(false)
	.source(config.folder.content)
	.destination(config.folder.public)
	.use(assign({
		linkTo: config.linkTo,
		homepageCentral: config.homepage === config.homepageCentral ? null : config.homepageCentral,
		homepage: config.homepage,
		countries: config.countries
	}))
	.use(modify({
		files: ["posts/**/*.md"],
		action: function (file, fileName) {
			file.file = file.created.toISOString().slice(0, 11).replace(/[-T]/g, "/") + fileName.split("/").pop();
			file.tags = (file.tags || []).split(", ");
		}
	}))
	.use(trueName())
	.use(propagateLocale({
		files: ["**/*.jade", "**/*.md", "manifest.json"],
		locales: config.locales
	}))
	.use(permalinkLocale({
		files: ["**/*.jade", "**/*.md", "manifest_*.json"],
		default: config.defaultLocale
	}))
	.use(i18n({
		default: config.defaultLocale,
		locales: config.locales,
		directory: config.folder.locales
	}))
	.use(modify({
		files: ["**/*.json"]
	}))
	.use(modify({
		default: config.defaultLocale,
		files: ["**/manifest.json"],
		action: function (file, fileName, opts) {
			file.contents.start_url = (file.locale === opts.default ? "" : "/" + file.locale) + file.contents.start_url;
		}
	}))
	.use(canonical({
		files: ["**/*.jade", "**/*.md"]
	}))
	.use(contentParserMarkdown({
		useMetadata: true
	}))
	.use(contentParserJade({
		useMetadata: true
	}))
	.use(layouts({
		engine: "jade",
		default: "blogpost.jade",
		pattern: "**/*.html"
	}))
	.use(inlineSource({
		source: config.folder.public,
		attribute: "data-inline",
		compress: false
	}))
	.build(function (err) {
		console.log(err || "Build successful.");
	});
