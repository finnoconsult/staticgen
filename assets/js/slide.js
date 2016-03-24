ctm(function (document) {
	"use strict";
	var slideTo = document.querySelectorAll(".narrative + .narrative");
	if (slideTo.length) {
		loadJS("/js/smooth-scroll.js", function () {
			[].forEach.call(slideTo, function (element) {
				if (element.id) {
					var anchor = document.createElement("a");
					anchor.href = "#" + element.id;
					anchor.className = "slide screen";
					anchor.setAttribute("data-scroll", "");
					var heading = element.querySelector("h2");
					anchor.textContent = heading.getAttribute("data-title") || heading.textContent;
					element.previousSibling.appendChild(anchor);
				}
			});
			smoothScroll.init();
		});
	}
});
