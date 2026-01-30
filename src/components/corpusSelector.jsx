import "bootstrap";
import { useEffect, useState } from "react";
import i18next from "i18next";
import corpora from "../js/locales/corpora";
import { Word2Vector } from "../js/w2v.ts";

function CorpusSelector() {
  const [lang, setLang] = useState(
    i18next.resolvedLanguage || i18next.language || "en"
  );

  useEffect(() => {
    const handleLanguageChange = (nextLang) => {
      setLang(nextLang);
    };

    i18next.on("languageChanged", handleLanguageChange);
    return () => {
      i18next.off("languageChanged", handleLanguageChange);
    };
  }, []);

  const corpusList = corpora.map(({ title }, index) => ({
    index: index,
    key: `corpus-${index}`,
    label: title[lang] ?? title.en ?? title.es ?? Object.values(title)[0],
  }));
  return (
    <span id="corpusSelector" className="dropdown">
      <button
        className="btn btn-primary dropdown-toggle translate"
        type="button"
        data-bs-toggle="dropdown"
        data-i18n="corpus"
      >
        Corpus
      </button>

      <ul className="dropdown-menu">
        {corpusList.map((d) => (
          <li key={d.key}>
            <a
              href="#"
              className="dropdown-item"
              onClick={(ev) => {
                window.w2v.dispose();
                window.w2v = new Word2Vector(corpora[d.index].text);
                window.w2v.initNetwork();
              }}
            >
              {d.label}
            </a>
          </li>
        ))}
      </ul>
    </span>
  );
}

export { CorpusSelector };
