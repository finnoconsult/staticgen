module.exports = plugin;

/**
 * Metalsmith plugin for assigning the path.
 *
 * @param {Object} opts
 * @return {Function}
 */

function plugin (opts) {
	opts = opts || {};

	return function (files, metalsmith, done) {
		for (var file in files) {
			var linkPath = file.slice(0, -".html".length);
			if (linkPath.endsWith("index")) {
				linkPath = linkPath.slice(0, -"index".length);
			}
			files[file].path = linkPath;
		}
		done();
	};
}
