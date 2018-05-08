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

var toBundle = [
	"js/crypto.js",
	"js/notexistis.js",
];

// https://stackoverflow.com/questions/33355528/filtering-an-array-with-a-function-that-returns-a-promise
// (async function() {
//   const myArray = [1, 2, 3, 4, 5]
//
//   // This is exactly what you'd expect to write
//   const results = await filter(myArray, async num => {
//     await doAsyncStuff()
//     return num > 2
//   })
//
// 	console.log('resutls',myArray,results);
// })()
//
//
// // Arbitrary asynchronous function
// function doAsyncStuff() {
//   return Promise.resolve();
// }
//
// // The helper function
// async function filter(arr, callback) {
//   const fail = Symbol()
//   return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i=>i!==fail)
// }


var isExists = file => fileExists(`${config.folder.assets}/${file}`).then(exists => exists);

var filterAsync = (array, filter) =>
  Promise.all(array.map(entry => filter(entry)))
  .then(bits => array.filter(entry => bits.shift()));

filterAsync(toBundle, isExists)
.then(entries => {

	// var entries.length

	metalsmith(config.folder.root)
		.clean(config.folder.cleanup)
		.source(config.folder.assets)
		.destination(config.folder.public)
		// .use(null)
		.use(browserify({
			// TODO: make optional?, at least for the second minification on the content
			"entries": entries,
			"browserifyOptions": {
				"ignoreMissing": true,
	    },
		}))
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

	console.log('entries?', toBundle, entries);
})
.catch(e => console.error(e));


//
// toBundle.filter(file => {console.log(`tODO: ${config.folder.assets}/${file} is exists?`); return false});
//
//
//
// bundling.push['a'];
// console.log('ex?', fileExists(`${config.folder.assets}/js/crypto.js`).then(exists => {if (exists)bundling.push['ok'];console.log('exists!', exists)}));
// bundling.push['c'];
// async console.log('bundling', bundling);
