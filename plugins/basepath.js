var path = require("path");

module.exports = plugin;

/**
 * Metalsmith plugin for setting the path.
 *
 * @param {Object} opts
 * @return {Function}
 */

function plugin (opts) {
	opts = opts || {};
	opts.property = opts.property || "file";

	return function (files, metalsmith, done) {
		for (var file in files) {
			files[file][opts.property] = path.parse(file).name;
		}
		done();
	};
}
