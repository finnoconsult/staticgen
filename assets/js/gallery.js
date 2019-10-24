var ctoClose = 0;

function galleryCloseAll() {
  ctoClose = setTimeout(galleryClose, 100);
}
function galleryClose(link) {
  clearTimeout(ctoClose);
  var c = window.location.href;
  window.location.href=(c.match(new RegExp(link)) || !link ? '#close' : link);
}


ctm(function (document) {
	"use strict";
	var images = document.querySelectorAll(".css-gallery [id^=gallery]");

  if (images.length) {
    [].forEach.call(images, function(element) {
      var r = new RegExp('(#.*)$', 'gi');
      var m = element.href.match(r);
      if (m) {
        element.href = "javascript:galleryClose('" + m[0]+"')";
      }
    });
	}
});
