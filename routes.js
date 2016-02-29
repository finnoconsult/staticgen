module.exports = function (pkg, data) {
	"use strict";
	var path = require("path");
	return {
		log: function (req, res, next) {
			console.info(req.method, req.path);
			next();
		},
		render: function (req, res) {
			var result = data.get(req.path);
			if (result.template) {
				res.status(result.error || 200).render(result.template, result);
			} else {
				res.status(result.error || 500).send(JSON.stringify(result));
			}
		},
		error: function (req, res) {
			res.status(404).send(JSON.stringify({
				status: 404,
				path: req.path
			}));
		}
	};
};
