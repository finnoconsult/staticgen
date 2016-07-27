module.exports = plugin;

/**
 * Metalsmith plugin for assigning global properties.
 *
 * @param {Object} opts
 * @return {Function}
 */

function plugin (opts) {
	opts = opts || {};

	return function (files, metalsmith, done) {
		var meta = metalsmith.metadata();
		for (var name in opts) {
			meta[name] = opts[name];
		}
		done();
	};
}
