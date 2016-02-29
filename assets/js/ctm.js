(function (document) {
	"use strict";
	if ("querySelectorAll" in document) {
		[].forEach.call(document.querySelectorAll(".email"), function (plain) {
			var anchor = document.createElement("a");
			anchor.className = "email";
			anchor.href = "mail" + "to:" + plain.textContent;
			anchor.textContent = plain.textContent;
			plain.classList.remove("email");
			plain.innerHTML = "";
			plain.appendChild(anchor);
		});
		loadJS("/js/particle-network.min.js", function () {
			var particleCanvas = document.createElement("div");
			particleCanvas.className = "particles";
			document.querySelector("body").appendChild(particleCanvas);
			new ParticleNetwork(particleCanvas, {
				particleColor: "#cdf6cd",
				background: "#fff",
				interactive: true,
				speed: "low",
				density: "high"
			});
		});
	}
}(document));
