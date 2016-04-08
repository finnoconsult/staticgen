/*! functionCutTheMustard: execute callback in "Mustard Cutting" browsers. (c)2016 @cssence, TRINN Consulting. License */
var ctm = (function (document, window) {
	"use strict";
	var makesTheCut = false;
	if ("querySelector" in document && typeof (document.body || document.documentElement).style.transition === "string" && document.querySelector("link[media=\"screen\"][href*=\"screen\"]")) {
		makesTheCut = true;
		var toggle = document.querySelector("html").classList;
		toggle.remove("no-js");
		toggle.add("js");
	}
	return function (cb) {
		return makesTheCut && typeof cb === "function" ? cb(document, window) : false;
	};
}(document, window));
