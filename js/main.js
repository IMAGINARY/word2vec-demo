import { w2v } from "./w2v.js";

document.getElementById(
  "article"
).innerHTML = `I eat seafood in Spain. I drink coffee in Italy. I eat fish in Japan. I eat pasta in Italy. I drink beer in Germany. I drink tea in Spain. I eat seafood in Japan. I drink coffee in Germany. I eat fish in Italy. I eat pasta in Spain. I drink beer in Japan. I drink tea in Japan.<b></b>`;

let using_ms_browser = undefined;
function detectMsBrowsers() {
  using_ms_browser =
    navigator.appName == "Microsoft Internet Explorer" ||
    (navigator.appName == "Netscape" &&
      navigator.appVersion.indexOf("Edge") > -1) ||
    (navigator.appName == "Netscape" &&
      navigator.appVersion.indexOf("Trident") > -1);
  if (using_ms_browser == true) {
    $("#ie_msg").removeAttr("hidden");
  }
}

// $(document).ready(function () {
//   detectMsBrowsers();
//   w2v.initNetwork();
// });

window.onload = () => {
  detectMsBrowsers();
  w2v.initNetwork();

  document
    .getElementById("w2v_training")
    .addEventListener("click", () => w2v.train());
};
