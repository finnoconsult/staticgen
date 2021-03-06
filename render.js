const crypto = require('crypto');
const metalsmith = require("metalsmith");
const contentParserJade = require("metalsmith-jade");
const contentParserMarkdown = require("metalsmith-markdown");
const layouts = require("metalsmith-layouts");
const i18n = require("metalsmith-i18n");
const collections = require("metalsmith-collections");
const collectionsMetadata = require("metalsmith-collection-metadata");
const paths = require("metalsmith-paths");
const propagateLocale = require("./plugins/propagate-locale.js");
const permalinkLocale = require("./plugins/permalink-locale.js");
//const json = require("./plugins/json.js");
const modify = require("./plugins/modify.js");
const inlineSource = require("./plugins/inline-source.js");
const assign = require("./plugins/assign.js");
const trueName = require("./plugins/truename.js");
const canonical = require("./plugins/canonical.js");


const config = require("./config.js");

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
		version: config.version,
		dates: config.dates,
		constants: config.constants,
		homepage: config.homepage,
		countries: config.countries
	}))
	.use(paths({
		 property: "paths"
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
		// default: "blogpost.jade",
		default: (config.layout && config.layout.default) || "base.jade",
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
