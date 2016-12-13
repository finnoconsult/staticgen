ctm(function (document) {
	"use strict";
	var qr = document.querySelector("#qr");
	if (qr) {
		qr.style = "background-image:url(" + qr.getAttribute("href") + ")";
		qr.addEventListener("click", function (event) {
			event.preventDefault();
			qr.classList.toggle("toggle");
		});
	}
});
