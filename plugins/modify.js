var path = require("path");
var multimatch = require("multimatch");

module.exports = plugin;

/**
 * Metalsmith plugin to modify metadata of files.
 * Content of JSON files can be modified too, hence JSON will be minified in the process.
 *
 * @param {Object} opts
 * @return {Function}
 */

function plugin (opts) {
	opts = opts || {};
	opts.files = opts.files || ["**/*"];
	opts.action = opts.action || function () {};

	return function (files, metalsmith, done) {
		var matchingFiles = multimatch(Object.keys(files), opts.files);
		matchingFiles.forEach(function (file) {
			var json = path.extname(file) === ".json";
			if (json) {
				files[file].contents = JSON.parse(files[file].contents.toString());
			}
			opts.action(files[file], file, opts);
			if (json) {
				files[file].contents = new Buffer(JSON.stringify(files[file].contents));
			}
		});
		done();
	};
}
