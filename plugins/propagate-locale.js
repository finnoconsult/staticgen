var path = require("path");
var multimatch = require("multimatch");

var DELIMITER = "_";
var DELIMITER_LOCALE = "-";

module.exports = plugin;

/**
 * Metalsmith plugin to duplicate content based on the locale.
 *
 * @param {Object} opts
 * @return {Function}
 */

function plugin (opts) {
	opts = opts || {};
	opts.locales = opts.locales || [];

	return function (files, metalsmith, done) {
		var matchingFiles = multimatch(Object.keys(files), opts.files);
		matchingFiles.forEach(function (file) {
			var name = path.parse(file).name.split(DELIMITER);
			name = {
				base: name[0],
				locale: name[1]
			};
			if (name.locale) {
				name.language = name.locale.split(DELIMITER_LOCALE)[0];
				if (name.locale.indexOf("-") !== -1) {
					name.country = name.locale.split(DELIMITER_LOCALE)[1];
				}
			}
			if (!name.country) {
				var locales = opts.locales;
				if (name.language) {
					locales = locales.filter(function (locale) {
						return locale.split(DELIMITER_LOCALE)[0] === name.language;
					});
				}
				locales.forEach(function (locale) {
					var newFile = path.parse(file);
					delete newFile.base;
					newFile.name = name.base + DELIMITER + locale;
					newFile = path.format(newFile);
					if (!files[newFile]) {
						files[newFile] = files[file];
					}
				});
				delete files[file];
			}
		});
		done();
	};
}
