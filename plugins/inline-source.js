var path = require("path");
var multimatch = require("multimatch");
var inlineSource = require("inline-source").sync;

module.exports = plugin;

/**
 * Metalsmith plugin, a wrapper for inline-source.
 *
 * @param {Object} opts
 * @return {Function}
 */

function plugin (opts) {
	opts = opts || {};
	opts.files = opts.files || ["**/*.html", "**/*.htm"];
	opts.rootpath = path.resolve(opts.rootpath || opts.source || metalsmith.source());

	return function (files, metalsmith, done) {
		var matchingFiles = multimatch(Object.keys(files), opts.files);
		matchingFiles.forEach(function (file) {
			var src = files[file].contents.toString();
			var result = inlineSource(src, opts);
			files[file].contents = new Buffer(result);
		});
		done();
	};
}
