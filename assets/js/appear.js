ctm(function (document, window) {
	"use strict";

	var lastKnownScrollPosition;
	var ticking = false;
	var scrolled = false;
	var selector = "[data-rsg]";
	var inViewport = function (element) {
		var threshold = parseFloat(element.getAttribute(selector.slice(1, -1)));
		var rect = element.getBoundingClientRect();
		var html = document.documentElement;
		var rectTrigger = rect.top + (rect.bottom - rect.top) * threshold;
		return rectTrigger >= 0 && rectTrigger <= (window.innerHeight || html.clientHeight);
	};
	var check = function (scrollPosition) {
		[].forEach.call(document.querySelectorAll(selector), function (element) {
			if (inViewport(element)) {
				element.removeAttribute(selector.slice(1, -1));
			}
		});
	};
	var handler = function (event) {
		lastKnownScrollPosition = window.scrollY;
		if (window.scrollY>0 && !scrolled) {
			document.body.classList.add('scrolled');
			scrolled = true;
		}
		if (window.scrollY===0 && scrolled) {
			document.body.classList.remove('scrolled');
			scrolled = false;
		}
		if (!ticking) {
			window.requestAnimationFrame(function () {
				check(lastKnownScrollPosition);
				ticking = false;
				if (!document.querySelectorAll(selector).length) {
					window.removeEventListener("scroll", handler);
				}
			});
		}
		ticking = true;
	};
	window.addEventListener("scroll", handler);
	handler();
});
