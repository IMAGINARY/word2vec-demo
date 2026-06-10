import { Word2Vector } from "./w2v.ts";
import {
  getCurrentLanguage,
  initI18n,
  localize,
} from "../components/langSelector.jsx";
import corpora from "./locales/corpora";

import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";

const container = document.getElementById("app");
const root = createRoot(container);

async function boot() {
  await initI18n;

  const currentLang = getCurrentLanguage();
  window.corpusText =
    corpora.filter((d) => d.language === currentLang)[0]?.text ??
    corpora[0]?.text ??
    "";

  root.render(<App />);

  requestAnimationFrame(() => {
    localize(".translate");
    window.w2v = new Word2Vector(window.corpusText);
    window.w2v.initNetwork();
  });
}

void boot();
