import { Word2Vector } from "./w2v.js";

const corpusText = `I eat seafood in Spain. I drink coffee in Italy. I eat fish in Japan. I eat pasta in Italy. I drink beer in Germany. I drink tea in Spain. I eat seafood in Japan. I drink coffee in Germany. I eat fish in Italy. I eat pasta in Spain. I drink beer in Japan. I drink tea in Japan.`;

window.onload = () => {
  const w2v = new Word2Vector(corpusText);
  w2v.initNetwork();

  console.log(w2v.nn);
  document
    .getElementById("w2v_training")
    .addEventListener("click", () => w2v.train());
};
