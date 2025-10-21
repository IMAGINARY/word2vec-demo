import { Word2Vector } from "./w2v.js";
import { localize } from "../components/langSelector.jsx";

window.corpusText = "";

window.onload = () => {
  localize(".translate");

  window.w2v = new Word2Vector(corpusText);
  window.w2v.initNetwork();

  console.log(window.w2v.nn);
  document
    .getElementById("w2v_training")
    .addEventListener("click", () => window.w2v.train());

  document.getElementById("w2v_step").addEventListener("click", () => {
    window.w2v.pause();
    window.w2v.trainDataPoint();
  });

  document
    .getElementById("w2v_pause")
    .addEventListener("click", () => window.w2v.pause());

  document
    .getElementById("w2v_reset")
    .addEventListener("click", () => window.w2v.reset());
};

import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
console.log(App);
const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
