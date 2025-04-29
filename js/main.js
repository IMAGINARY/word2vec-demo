import { Word2Vector } from "./w2v.js";

document.getElementById(
  "article"
).innerHTML = `I eat seafood in Spain. I drink coffee in Italy. I eat fish in Japan. I eat pasta in Italy. I drink beer in Germany. I drink tea in Spain. I eat seafood in Japan. I drink coffee in Germany. I eat fish in Italy. I eat pasta in Spain. I drink beer in Japan. I drink tea in Japan.<b></b>`;

window.onload = () => {
  const w2v = new Word2Vector();
  w2v.initNetwork();

  console.log(w2v.nn);
  document
    .getElementById("w2v_training")
    .addEventListener("click", () => w2v.train());
};
