import { Word2Vector } from "./w2v.ts";
import { localize } from "../components/langSelector.jsx";
import i18next from "i18next";
import corpora from "./locales/corpora";

const currentLang = i18next.resolvedLanguage || i18next.language || "en";

window.corpusText =
  corpora.filter((d) => d.language === currentLang)[0]?.text ??
  corpora[0]?.text ??
  "";

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
