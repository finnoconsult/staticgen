var path = require("path");
var multimatch = require("multimatch");

var DELIMITER = "_";

module.exports = plugin;

/**
 * Metalsmith plugin to rewire file name base on locale.
 *
 * @param {Object} opts
 * @return {Function}
 */

function plugin (opts) {
	opts = opts || {};

	return function (files, metalsmith, done) {
		var matchingFiles = multimatch(Object.keys(files), opts.files);
		matchingFiles.forEach(function (file) {
			var permalink = getPermalink(file, opts.default);
			var content = clone(files[file]);
			content.locale = permalink.locale;
			content.basePath = getDefaultPath(file);
			files[path.format(permalink)] = content;
			delete files[file];
		});
		done();
	};
}

/* returns cloned object */
function clone (source) {
	var cloned = {};
	for (var property in source) {
		cloned[property] = source[property];
	}
	return cloned;
}

/* returns rewired path-able object that also includes a locale property */
function getPermalink (file, defaultLocale) {
	var name = path.parse(file).name.split(DELIMITER);
	name = {
		base: name[0],
		locale: name[1]
	};
	var newFile = path.parse(file);
	delete newFile.base;
	newFile.name = name.base;
	if (name.locale !== defaultLocale) {
		newFile.dir = newFile.dir ? name.locale + "/" + newFile.dir : name.locale;
	}
	newFile.locale = name.locale;
	return newFile;
}

/* returns default path without locale */
function getDefaultPath (file) {
	var basePath = path.parse(file);
	basePath.name = basePath.name.split(DELIMITER)[0];
	delete basePath.ext;
	delete basePath.base;
	basePath = "/" + path.format(basePath).replace(/\\/g, "/");
	return basePath;
}
