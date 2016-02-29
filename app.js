/*jshint node: true */
"use strict";
var path = require("path");

// Configuration
var pkg = require(path.join(__dirname, "package.json"));
pkg.config.port = process.env.PORT || pkg.config.port || 8080;
pkg.config.verbose = "false" === (process.env.VERBOSE || "").toLowerCase() ? false : (pkg.config.verbose || true);
var data = require(path.join(__dirname, "data.js"))(pkg);

// Initialization
var app = require("express")();
var serve = require("serve-static");
app.set("port", pkg.config.port);
app.use(serve(path.join(__dirname, pkg.config.folders.db), {index: false}));
app.use(serve(path.join(__dirname, pkg.config.folders.assets), {index: false}));
app.locals.basedir = path.join(__dirname, pkg.config.folders.views);
app.set("views", path.join(__dirname, pkg.config.folders.views));
app.set("view engine", "jade");

// Routes
var routes = require(path.join(__dirname, "routes.js"))(pkg, data);
app.all("*", routes.log);
app.get("*", routes.render);
app.use(routes.error);

// Http server
require("http").createServer(app).listen(pkg.config.port, function () {
	console.info("Express server running, PORT=%d, DB=%s, VERBOSE=%s", pkg.config.port, pkg.config.folders.db, pkg.config.verbose);
});
