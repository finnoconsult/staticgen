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
			var name = path.parse(file).name.split(DELIMITER);
			name = {
				base: name[0],
				locale: name[1]
			};
			var newFile = path.parse(file);
			delete newFile.base;
			newFile.name = name.base;
			if (name.locale !== opts.default) {
				newFile.dir = newFile.dir ? name.locale + "/" + newFile.dir : name.locale;
			}
			newFile = path.format(newFile);
			var newContent = {};
			for (var property in files[file]) {
				newContent[property] = files[file][property];
			}
			newContent.locale = name.locale;
			files[newFile] = newContent;
			delete files[file];
		});
		done();
	};
}
