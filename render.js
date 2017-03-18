var metalsmith = require("metalsmith");
var contentParserJade = require("metalsmith-jade");
var contentParserMarkdown = require("metalsmith-markdown");
var layouts = require("metalsmith-layouts");
var i18n = require("metalsmith-i18n");
var collections = require("metalsmith-collections");
var collectionsMetadata = require("metalsmith-collection-metadata");
var contentParserMarkdown = require("metalsmith-markdown");
var propagateLocale = require("./plugins/propagate-locale.js");
var permalinkLocale = require("./plugins/permalink-locale.js");
//var json = require("./plugins/json.js");
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
		urlify: config.urlify,
		moment: require("moment"),
		sharingLinks: require("./assets/social.json"), /*TODO json.js*/
		knownAuthors: require("./assets/knownAuthors.json"), /*TODO json.js*/
		homepageCentral: config.homepage === config.homepageCentral ? null : config.homepageCentral,
		homepage: config.homepage,
		countries: config.countries
	}))
	//.use(json({
	//	files: ["**/*.json"],
	//}))
	.use(modify({
		files: ["posts/**/*.md"],
		action: function (file, fileName) {
			file.file = file.created.toISOString().slice(0, 8).replace(/\-/g, "/") + fileName.split("/").pop();
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
	.use(collections({
		blog: {
			sortBy: "created",
			reverse: true
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
