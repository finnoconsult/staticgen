/*jshint node: true */
"use strict";
var path = require("path");

var pkg = require(path.join(__dirname, "package.json"));
pkg.config.port = process.env.PORT || pkg.config.port || 8080;
pkg.config.verbose = "false" === (process.env.VERBOSE || "").toLowerCase() ? false : (pkg.config.verbose || true);
var data = require(path.join(__dirname, "data.js"))(pkg);

var routes = require(path.join(__dirname, "routes.js"))(pkg, data);
var app = require("express")();
app.set("port", pkg.config.port);
app.locals.basedir = path.join(__dirname, pkg.config.folders.views);
app.all("*", routes.log);
app.use(require("serve-static")(path.join(__dirname, pkg.config.folders.assets), {index: false}));
app.set("views", path.join(__dirname, pkg.config.folders.views));
app.set("view engine", "jade");
app.get("*", routes.render);
app.use(routes.error);

require("http").createServer(app).listen(pkg.config.port, function () {
	console.info("Express server running, PORT=%d, VERBOSE=%s", pkg.config.port, pkg.config.verbose);
});
