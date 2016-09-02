module.exports = plugin;
var path = require("path");
var multimatch = require("multimatch");

/**
 * Metalsmith plugin for assigning the path to static files.
 *
 * @param {Object} opts
 * @return {Function}
 */

function plugin (opts) {
	opts = opts || {};
	opts.files = opts.files || ["**/*.html"];

	return function (files, metalsmith, done) {
		var matchingFiles = multimatch(Object.keys(files), opts.files);
		matchingFiles.forEach(function (file) {
			var linkPath = file.slice(0, -path.extname(file).length);
			if (linkPath.endsWith("index")) {
				linkPath = linkPath.slice(0, -"index".length);
			}
			files[file].path = "/" + linkPath;
		});
		done();
	};
}
