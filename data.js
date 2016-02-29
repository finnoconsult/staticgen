module.exports = function (pkg) {
	"use strict";
	var path = require("path");
	var fs = require("fs");
	var jade = require("jade");
	var cache = {};
	var load = function (file) {
		if (pkg.config.verbose || !cache[file]) {
			var fn = {
				withPath: path.join(__dirname, pkg.config.folders.db, file),
				extension: file.split(".").pop()
			};
			if (fn.extension === "json" || fn.extension === "js") {
				cache[file] = require(fn.withPath);
			} else {
				cache[file] = fs.readFileSync(fn.withPath, "utf8");
			}
		}
		return cache[file];
	};
	var getTemplates = function () {
		return load("sitemap.json");
	};
	var getFile = function (href) {
		return (href + (href.slice(-1) === "/" ? "index.html" : ".html")).slice(1);
	};
	try {
		if (!fs.statSync(path.join(__dirname, "data")).isDirectory()) {
			throw new Error("Invalid folder /data");
		}
		pkg.config.folders.db = "data";
	} catch (err) {
		console.warn("No valid data directory found, resorting to demo mode.");
	}
	return {
		get: function (href) {
			var data = {
				verbose: pkg.config.verbose,
				path: href,
				link: {
					self: pkg.homepage,
					to: function (uri) {
						return (!data.verbose && data.link.delegate ? data.link.delegate.slice(0, -1) : "") + uri;
					}
				}
			};
			var augment = function (assignment) {
				var key = data;
				var value;
				assignment.node.split(".").slice(0, -1).forEach(function (node) {
					if (!key[node]) {
						key[node] = {};
					}
					key = key[node];
				});
				var file;
				if (assignment.load) {
					file = typeof assignment.load === "function" ? assignment.load(data) : assignment.load;
					value = load(file);
				} else if (assignment.render) {
					file = typeof assignment.render === "function" ? assignment.render(data) : assignment.render;
					value = jade.renderFile(path.join(__dirname, pkg.config.folders.db, file), data);
				} else if (assignment.set) {
					value = typeof assignment.set === "function" ? assignment.set(data) : assignment.set;
				}
				key[assignment.node.split(".").pop()] = value;
			};
			var fetch = load("fetch.js");
			(fetch["*"] || []).forEach(augment);
			if (href === "*") {
				return data;
			}
			var templates = getTemplates();
			if (!templates[href]) {
				data.error = 404;
				href = "/404";
				if (!templates[href]) {
					return {error: 404, path: data.path};
				}
			}
			data.file = getFile(href);
			data.template = templates[href];
			(fetch[data.template] || []).forEach(augment);
			return data;
		},
		/*toFile: function (href) {
			return getFile(href);
		},*/
		toPath: function (dest, file) {
			return Object.keys(getTemplates()).filter(function (href) { return [dest, getFile(href)].join("/") === file; })[0];
		},
		/*toTemplate: function (href) {
			return templates[href];
		},*/
		list: function () {
			return templates.refresh().keys();
		},
		map: function (src, dest) {
			var map = {};
			var templates = getTemplates();
			Object.keys(templates).forEach(function (href) {
				map[[dest, getFile(href)].join("/")] = [src, templates[href]].join("/");
			});
			return map;
		}
	};
};
