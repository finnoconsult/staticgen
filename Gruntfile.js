module.exports = function (grunt) {
	"use strict";

	// project configuration
	grunt.file.defaultEncoding = "utf8";

	// project data
	var pkg = require("./package.json");
	var data = require("./data.js")(pkg);

	// project initialization
	grunt.config.init({

		dir: pkg.config.folders,

		data: data,

		// clean staging directory
		clean: {
			temp: ["<%= dir.temp %>"],
			live: ["<%= dir.rendered %>"],
			unminified: {
				expand: true,
				cwd: "<%= dir.rendered %>/",
				src: ["img/*.max.*"]
			}
		},

		// css autoprefix and minify
		postcss: {
			options: {
				processors: [
					require("autoprefixer")(),
					require("cssnano")()
				]
			},
			styles: {
				expand: true,
				cwd: "<%= dir.assets %>/",
				src: "css/*.css",
				dest: "<%= dir.temp %>/"
			}
		},

		// js minify
		uglify: {
			scripts: {
				options: { screwIE8: true },
				expand: true,
				cwd: "<%= dir.assets %>/",
				src: ["js/*.js", "!js/*.min.js"],
				dest: "<%= dir.temp %>/"
			}
		},

		// file copy
		copy: {
			assets: {
				expand: true,
				cwd: "<%= dir.assets %>",
				src: "**",
				dest: "<%= dir.rendered %>/"
			},
			build: {
				expand: true,
				cwd: "<%= dir.temp %>",
				src: "**",
				dest: "<%= dir.rendered %>/"
			}
		},

		// jade compile
		jade: {
			compileTemplate: {
				options: {
					data: function (dest, src) {
						var data = grunt.config("data");
						grunt.log.writeln("Rendering \"%s\": %s", "/", dest);
						return data.get("/");
					}
				},
				files: data.templates(pkg.config.folders.views, pkg.config.folders.temp)
			},
			compile: {
				options: {
					data: function (dest, src) {
						var data = grunt.config("data");
						var path = data.toPath(pkg.config.folders.rendered, dest);
						grunt.log.writeln("Rendering \"%s\": %s", path, dest);
						return data.get(path);
					}
				},
				files: data.files(pkg.config.folders.views, pkg.config.folders.rendered)
			}
		}

	});

	// required external tasks
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-postcss");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-jade");

	// task definition
	grunt.registerTask(
		"render",
		"Render templates (HTML snippets)",
		["clean:temp", "jade:compileTemplate"]
	);
	grunt.registerTask(
		"build",
		"Prepare assets (minification)",
		["clean:temp", "postcss", "uglify"]
	);
	grunt.registerTask(
		"release",
		"Generate static site",
		["clean:live", "copy:assets", "copy:build", "jade:compile", "build", "clean:unminified"]
	);
	grunt.registerTask("default", ["build", "release"]);
};
