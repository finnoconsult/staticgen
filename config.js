var path = require("path");
var colors = require("colors");
var home = __dirname;
var switches = {};

function argHelper(arg, index) {
	var switchMap = {"-p": "preserveTargetDir", "-d": "developmentMode", "--preserve-target-dir": "preserveTargetDir" ,"-u=": "url", "--url=":"url"};

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
var mainPkg = require("./package.json");

if (mainPkg.version !== pkg.version) {
	const isLower = (pkg.version >= mainPkg.version);
	const color = isLower ? colors.yellow : colors.red;
	const textLower = isLower ? "is lower**" : "is greater**";
	console.log(color('WARNING: Static Generator version'), mainPkg.version, color(textLower).bold, color('than the Content version'), pkg.version);
	console.log('(** HINT: You can still generate the public folder content, however need to test all pages and CSS)'.italic.grey);
}
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
	isDevelopment: switches.developmentMode === true,
	isProduction: !switches.developmentMode,
	homepageCentral: switches.url ? switches.url : "https://www.finnoconsult.at",
	// homepageCentral: "https://www.innovaciostanacsado.com",
	// Todo: get this from config!
	homepage: pkg.homepage,
	version: pkg.version,
	dates: pkg.dates,
	constants: pkg.constants,
	toBrowserify: pkg.toBrowserify,
	defaultLocale: defaultLocale,
	locales: locales.map(function (locale) { return locale.id; }),
	countries: locales,
	linkTo: function (locale, path, crossdomain) {
		const onlyHome = pkg.constants && pkg.constants.link && pkg.constants.link[locale] && pkg.constants.link[locale].onlyHome;
		const subPath = (!onlyHome && path || "");
		// console.log('subPath', locale, path, '?', onlyHome, '=>', subPath);
		return (crossdomain || "") + (locale === defaultLocale ? "" : "/" + locale) + subPath;
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
