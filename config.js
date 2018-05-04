var path = require("path");
var home = __dirname;
var switches = {};

function argHelper(arg, index) {
	var switchMap = {"-p": "preserveTargetDir", "--preserve-target-dir": "preserveTargetDir" ,"-u=": "url", "--url=":"url"};

	for (var sourceTag in switchMap) {
		var keyExp = new RegExp('^'+sourceTag, 'i');

		if (arg.match(keyExp)) {
			Object.assign(switches, { [switchMap[sourceTag]] : arg.replace(keyExp, '') || true });
		}
	}
}
process.argv.slice(2).forEach(function (arg, index) {
	if (arg.indexOf("--") === 0) {
		argHelper(arg);
	} else if (arg.indexOf("-") === 0) {
		argHelper(arg);
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
		cleanup: !switches.preserveTargetDir,
		assets: path.join(home, "assets"),
		content: path.join(home, "content"),
		locales: path.join(__dirname, "locales"),
		public: path.join(__dirname, "public")
	},
	homepageCentral: switches.url ? switches.url : "https://www.finnoconsult.at",
	// homepageCentral: "https://www.innovaciostanacsado.com",
	// Todo: get this from config!
	homepage: pkg.homepage,
	version: pkg.version,
	dates: pkg.dates,
	constants: pkg.constants,
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
