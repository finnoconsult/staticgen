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
	var domain = process.env.DOMAIN || pkg.config.domain || pkg.homepage;
	var linkTo = function (link) {
		if (link.path) {
			if (domain === pkg.homepage) {
				return link.path;
			} else {
				return pkg.homepage + link.path.slice(1);
			}
		}
		return link.url;
	};
	return {
		get: function (path) {
			var data = {
				verbose: pkg.config.verbose,
				domain: domain,
				homepage: pkg.homepage,
				path: path,
				linkTo: linkTo,
				finnofy: function (text) {
					var replacement = "Finno".replace(/n/g, "<span class=\"nn\">n</span>");
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
		templates: function (srcFolder, destFolder) { // batch/grunt
			var fileMap = {};
			["header", "navigation", "footer"].forEach(function (id) {
				var dest = destFolder + "/snippet_" + id + ".html";
				var src = srcFolder + "/" + id + ".jade";
				fileMap[dest] = src;
			});
			return fileMap;
		},
		files: function (srcFolder, destFolder) { // batch/grunt
			var fileMap = {};
			mapData.filter(function (item) {
				return item.template;
			}).forEach(function (item) {
				var dest = destFolder + "/" + item.file;
				var src = srcFolder + "/" + item.template;
				fileMap[dest] = src;
			});
			return fileMap;
		}
	};
};
