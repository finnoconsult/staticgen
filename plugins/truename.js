module.exports = plugin;

/**
 * Metalsmith plugin for renaming files.
 *
 * @param {Object} opts
 * @return {Function}
 */

function plugin (opts) {
	opts = opts || {};
	opts.property = opts.property || "file";

	return function (files, metalsmith, done) {
		for (var file in files) {
			var replacement = files[file][opts.property];
			if (replacement && replacement !== file) {
				files[replacement] = files[file];
				delete files[file];
			}
		}
		done();
	};
}
