module.exports = function (grunt) {
	"use strict";

	// project configuration
	grunt.file.defaultEncoding = "utf8";

	// project initialization
	grunt.config.init({

		// clean staging directory
		clean: {
			temp: ["build"],
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
				cwd: "assets/",
				src: "css/*.css",
				dest: "build/"
			}
		},

		// js minify
		uglify: {
			scripts: {
				options: { screwIE8: true },
				expand: true,
				cwd: "assets/",
				src: ["js/*.js", "!js/*.min.js"],
				dest: "build/"
			}
		},


	});

	// required external tasks
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-postcss");
	grunt.loadNpmTasks("grunt-contrib-uglify");

	// task definition
	grunt.registerTask(
		"build",
		"Prepare assets (minification)",
		["clean", "postcss", "uglify"]
	);
	grunt.registerTask("default", ["build"]);
};
