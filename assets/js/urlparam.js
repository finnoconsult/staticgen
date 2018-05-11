ctm(function (document, window) {
  "use strict";

  var getUrlParameter = function (name, defaultValue="") {
    const foundParam = window.location.search
      .replace(/^\?/,'')
      .split('&')
      .map(function(item) {
        var param = item.split('=');
        return { name: param[0], value: param[1] };
      })
      .find(function(param){return name===param.name});
    return (foundParam && foundParam.value) || defaultValue;
  }

  window.projectUrlParameterToDom = function(params) {
    Object.keys(params).map(function(param) {
      document.getElementById(params[param]).innerText=decodeURIComponent(getUrlParameter(param));
    })
  }


});
