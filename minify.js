var crypto = require('crypto');
var metalsmith = require("metalsmith");
var ignore = require("metalsmith-ignore");
var minifyCss = require("metalsmith-myth");
// https://www.npmjs.com/package/metalsmith-browserify
var browserify = require("metalsmith-browserify");
var minifyJs = require("./plugins/uglify.js");
var fileExists = require('file-exists');
var assign = require("./plugins/assign.js");

var config = require("./config.js");


// https://stackoverflow.com/questions/33355528/filtering-an-array-with-a-function-that-returns-a-promise
var isExists = file => fileExists(`${config.folder.assets}/${file}`).then(exists => exists);

var filterAsync = (array, filter) =>
  Promise.all(array.map(entry => filter(entry)))
  .then(bits => array.filter(entry => bits.shift()));

filterAsync(config.toBrowserify || [], isExists)
.then(entries => {

	// TODO: make optional, at least for the second minification on the content
	const browserifiedFilesPlugin = entries.length >0 ?
		browserify({
			"entries": entries,
			"browserifyOptions": {
				"ignoreMissing": true,
			},
		}) :
		assign({
			"browserifiedFiles": 0
		});

	// console.debug('browserifying entries:', entries, browserifiedFilesPlugin);

	metalsmith(config.folder.root)
		.clean(config.folder.cleanup)
		.source(config.folder.assets)
		.destination(config.folder.public)
		.use(browserifiedFilesPlugin)
		.use(ignore([
			"img/*.max.*"
		]))
		.use(minifyJs())
		.use(minifyCss({
			files: "**/*.css",
			compress: true
		}))
		.build(function (err) {
			console.log(err || ((config.folder.cleanup ? "CleanUp & " : "") + "Asset preparation successful."));
		});

})
.catch(e => console.error(e));
