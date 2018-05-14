ctm(function (document, window) {
  "use strict";

  var getUrlParameter = function (name, defaultValue) {
    const foundParam = window.location.search
      .replace(/^\?/,'')
      .split('&')
      .map(function(item) {
        var param = item.split('=');
        return { name: param[0], value: param[1] };
      })
      .find(function(param){return name===param.name});
    return (foundParam && foundParam.value) || defaultValue || "";
  }

  var defaultFormatterFunc = function(v) {return v;}

  window.projectUrlParameterToDom = function(params, formatterFunc) {
    const formatter = formatterFunc || defaultFormatterFunc;
    // console.log('formatterFunc', formatterFunc, formatter);
    Object.keys(params).map(function(param) {
      // console.log('urlparam:',param, decodeURIComponent(getUrlParameter(param)));
      document.getElementById(params[param]).innerText=formatter(decodeURIComponent(getUrlParameter(param)));
    })
  }


});
