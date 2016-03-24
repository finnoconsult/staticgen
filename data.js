module.exports = function (pkg) {
	"use strict";
	var mapData = require(require("path").join(__dirname, "sitemap.json"));
	var mapping = {};
	mapData.forEach(function (item) {
		if (item.path) {
			item.file = (item.path + (item.path.slice(-1) === "/" ? "index.html" : ".html")).slice(1);
			mapping[item.path] = item;
		}
	});
	return {
		get: function (path) {
			var data = {
				verbose: pkg.config.verbose,
				homepage: pkg.homepage,
				path: path,
				//anchorify: function (selector, heading, reference) {
					//return "<a href=\"$1\" data-anchor=\"$3\">$2</a>".replace("$1", selector).replace("$2", heading).replace("$3", reference || heading);
				//},
				finnofy: function (text) {
					var replacement = "Finno".replace("nn", "<i class=\"nn\">nn</i>");
					return text.replace("Finno", replacement);
				},
				sitemap: function (options) {
					if (options.list) {
						return mapData.filter(function (item) { return item[options.list]; });
					} else if (options.find) {
						return mapData.filter(function (item) { return item[options.find] && item[options.find].toLowerCase() === options.value.toLowerCase(); })[0];
					}
					return [];
				}
			};
			if (!mapping[path]) {
				return {error: 404, path: data.path};
			}
			data.template = mapping[path].template;
			data.document = mapping[path].document;
			return data;
		},
		toPath: function (dest, file) { // batch/grunt
			var query = file.split("/").slice(1).join("/");
			return mapData.filter(function (item) { return item.file === query; })[0].path;
		},
		files: function (srcFolder, destFolder) { // batch/grunt
			var fileMap = {};
			mapData.forEach(function (item) {
				var dest = destFolder + "/" + item.file;
				var src = srcFolder + "/" + item.template;
				fileMap[dest] = src;
			});
			return fileMap;
		}
	};
};
