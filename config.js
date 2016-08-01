var pkg = require("./package.json");
var locales = require("./assets/locales.json");

module.exports = {
	domain: process.env.DOMAIN || pkg.homepage,
	homepage: pkg.homepage,
	defaultLocale: locales.filter(function (locale) { return locale.default; })[0].id,
	locales: locales.map(function (locale) { return locale.id; }),
	countries: locales
};
