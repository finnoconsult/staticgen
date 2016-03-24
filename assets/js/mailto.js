ctm(function (document) {
	"use strict";
	[].forEach.call(document.querySelectorAll(".email"), function (plain) {
		var anchor = document.createElement("a");
		anchor.className = plain.className;
		anchor.href = "mail" + "to:" + plain.textContent;
		anchor.innerHTML = plain.innerHTML;
		plain.classList.remove("email");
		plain.innerHTML = "";
		plain.appendChild(anchor);
	});
});
