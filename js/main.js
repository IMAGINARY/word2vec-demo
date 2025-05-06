import { Word2Vector } from "./w2v.js";

const corpusText_en = `I eat seafood in Spain. I drink coffee in Italy. I eat fish in Japan. I eat pasta in Italy. I drink beer in Germany. I drink tea in Spain. I eat seafood in Japan. I drink coffee in Germany. I eat fish in Italy. I eat pasta in Spain. I drink beer in Japan. I drink tea in Japan.`;

const corpusText_es = `Como marisco en España. Bebo café en Italia. Como pescado en Japón. Como pasta en Italia. Bebo cerveza en Alemania. Bebo té en España. Como marisco en Japón. Bebo café en Alemania. Como pescado en Italia. Como pasta en España. Bebo cerveza en Japón. Bebo té en Japón.`;

window.onload = () => {
  const w2v = new Word2Vector(corpusText_en);
  w2v.initNetwork();

  console.log(w2v.nn);
  document
    .getElementById("w2v_training")
    .addEventListener("click", () => w2v.train());

  document
    .getElementById("w2v_step")
    .addEventListener("click", () => w2v.trainDataPoint());

  document
    .getElementById("w2v_pause")
    .addEventListener("click", () => w2v.pause());
};
