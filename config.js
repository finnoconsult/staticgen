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

module.exports = {
	folder: {
		root: __dirname,
		cleanup: switches.indexOf("--preserve-target-dir") === -1,
		assets: path.join(home, "assets"),
		content: path.join(home, "content"),
		locales: path.join(__dirname, "locales"),
		public: path.join(__dirname, "public")
	},
	domain: process.env.DOMAIN || pkg.homepage,
	homepage: pkg.homepage,
	defaultLocale: locales.filter(function (locale) { return locale.default; })[0].id,
	locales: locales.map(function (locale) { return locale.id; }),
	countries: locales
};
