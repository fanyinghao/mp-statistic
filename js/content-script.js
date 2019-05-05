window.onload = function() {
  console.log("loaded");
  injectCustomJs();
};

function injectCustomJs(jsPath) {
  var av = document.createElement("script");
//   av.src = chrome.extension.getURL("js/av-min.js");
  av.src = "//cdn.jsdelivr.net/npm/leancloud-storage@3.13.0/dist/av-min.js";
  av.onload = function() {
    jsPath = jsPath || "js/inject.js";
    var temp = document.createElement("script");
    temp.setAttribute("type", "text/javascript");
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function() {
      this.parentNode.removeChild(this);
    };
    document.head.appendChild(temp);
  };
  document.head.appendChild(av);
}
