ctm(function (document) {
	"use strict";
	var slideTo = document.querySelectorAll(".narrative + .narrative");
	console.log('slideTo', slideTo);
	if (slideTo.length) {
		loadJS("/js/smooth-scroll.js", function () {
			[].forEach.call(slideTo, function (element) {
				if (element.id) {
					var anchor = document.createElement("a");
					anchor.href = "#" + element.id;
					anchor.className = "slide-link screen";
					anchor.setAttribute("data-scroll", "");
					var heading = element.querySelector("h2");
					if (!heading) console.warn('no h2 in ', element.id);
					if (heading) {
						anchor.textContent = heading.getAttribute("data-title") || heading.textContent;
						element.previousSibling.appendChild(anchor);
						if (heading.onclick) anchor.onclick = heading.onclick;
					}
				}
			});
			smoothScroll.init();
		});
	}
});
