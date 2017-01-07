var path = require("path");
var home = __dirname;
var switches = [];
process.argv.slice(2).forEach(function (arg) {
	if (arg.indexOf("--") === 0) {
		switches.push(arg);
	} else if (arg.indexOf("-") === 0) {
		var switchMap = {"-p": "--preserve-target-dir"};
		switches.push(switchMap[arg]);
	} else {
		home = path.join(__dirname, arg);
	}
});

var pkg = require(path.join(home, "package.json"));
var locales = require(path.join(home, "content/locales.json"));
var defaultLocale = locales.filter(function (locale) { return locale.default; })[0].id;

module.exports = {
	folder: {
		root: __dirname,
		cleanup: switches.indexOf("--preserve-target-dir") === -1,
		assets: path.join(home, "assets"),
		content: path.join(home, "content"),
		locales: path.join(__dirname, "locales"),
		public: path.join(__dirname, "public")
	},
	homepageCentral: "https://www.finnoconsult.at",
	homepage: pkg.homepage,
	defaultLocale: defaultLocale,
	locales: locales.map(function (locale) { return locale.id; }),
	countries: locales,
	linkTo: function (locale, path, crossdomain) {
		return (crossdomain || "") + (locale === defaultLocale ? "" : "/" + locale) + path;
	},
	urlify: function (text) {
		text = text.toLowerCase();
		var unsafe = {" ": "-", "ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss"};
		Object.keys(unsafe).forEach(function (unsafeChar) {
			var r = new RegExp(unsafeChar, "g");
			text = text.replace(r, unsafe[unsafeChar]);
		});
		return text;
	},
	timify: function (text) {
		
		text = text.toLowerCase();
		var unsafe = {" ": "-", "ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss"};
		Object.keys(unsafe).forEach(function (unsafeChar) {
			var r = new RegExp(unsafeChar, "g");
			text = text.replace(r, unsafe[unsafeChar]);
		});
		return text;
	}
};
