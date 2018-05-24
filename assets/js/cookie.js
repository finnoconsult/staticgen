function getDomain(chunks) {
  var maxChunks = chunks || 2;
  // var host = "finnoconsult.at";
  var host = (window.location && window.location.hostname) || '';
  var domainParts = host.split('.');
  domain = (domainParts.length>maxChunks ? domainParts.slice(domainParts.length-maxChunks) : domainParts).join('.');
  return domain;
}
function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (200 * 24 * 60 * 60 * 1000));

    document.cookie = key + '=' + value + ';domain=' + getDomain() + ';expires=' + expires.toUTCString();
}
function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

ctm(function (document, window) {
	"use strict";
  var cookieName = (getDomain().replace(/\./gi,'')) + 'CookieAccepted';

  var keyValue = document.cookie.match('(^|;) ?' + cookieName + '=([^;]*)(;|$)');
	var cd = document.querySelector("cookie.disclaimer");
  if (cd) {
  	if (keyValue ? keyValue[2] : null) {
      cd.classList.toggle("accepted");
  	} else {
      setTimeout(function() { cd.classList.toggle("display")}, 500);
      var b = cd.querySelector("button");
      if (b) {
        b.addEventListener("click", function (event) {
    			event.preventDefault();
    			cd.classList.toggle("accepted");
          // var expires = new Date();
          // expires.setTime(expires.getTime() + (200 * 24 * 60 * 60 * 1000)); // expires in 200 days
          // document.cookie = cookieName + '=' + true + ';expires=' + expires.toUTCString();
          setCookie(cookieName, true);
    		});
      }
    }
  }
});
