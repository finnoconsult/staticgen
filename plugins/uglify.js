var multimatch = require("multimatch");
var uglify = require("uglify-js");

module.exports = plugin;

/**
 * Metalsmith plugin, a wrapper for uglify.
 *
 * @param {Object} opts
 * @return {Function}
 */

function plugin (opts) {
	opts = opts || {};
	opts.files = opts.files || ["**/*.js", "!**/*.min.js"];
	opts.fromString = true;

	return function (files, metalsmith, done) {
		var matchingFiles = multimatch(Object.keys(files), opts.files);
		matchingFiles.forEach(function (file) {
			var src = files[file].contents.toString();
			var result = uglify.minify(src, opts).code;
			files[file].contents = new Buffer(result);
		});
		done();
	};
}
