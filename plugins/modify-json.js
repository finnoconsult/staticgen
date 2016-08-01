var path = require("path");
var multimatch = require("multimatch");

module.exports = plugin;

/**
 * Metalsmith plugin to minify and potentially augment (e.g. i18nize a base manifest) JSON files.
 *
 * @param {Object} opts
 * @return {Function}
 */

function plugin (opts) {
	opts = opts || {};
	opts.files = opts.files || ["**/*.json"];

	return function (files, metalsmith, done) {
		var matchingFiles = multimatch(Object.keys(files), opts.files);
		matchingFiles.forEach(function (file) {
			var fileName = path.parse(file).base;
			var src = files[file].contents.toString();
			var result = JSON.parse(src);
			var locale = files[file].locale;
			if (fileName === "manifest.json") {
				result.start_url = (locale === opts.default ? "" : "/" + locale) + result.start_url;
			}
			files[file].contents = new Buffer(JSON.stringify(result));
		});
		done();
	};
}
