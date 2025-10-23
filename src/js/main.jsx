import { Word2Vector } from "./w2v.ts";
import { localize } from "../components/langSelector.jsx";

window.corpusText = "Select a language to load the corpus text.";

window.onload = () => {
  localize(".translate");
  window.w2v = new Word2Vector(corpusText);
  window.w2v.initNetwork();
  // console.log(window.w2v.nn);
};

import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
console.log(App);
const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
