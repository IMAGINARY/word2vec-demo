import "bootstrap";
import locales from "../js/locales/locales";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import locI18next from "loc-i18next";
import { Word2Vector } from "../js/w2v.ts";
import corpora from "../js/locales/corpora";

// Filter here the languages to appear in the UI.
const langList = locales
  .map(({ isoCode, endonym }) => ({ isoCode, endonym }))
  .filter((d) => ["en", "de", "fr", "es", "uk"].includes(d.isoCode));

const iconTranslate = new URL("../img/translate.svg", import.meta.url).href;
const supportedLanguages = langList.map(({ isoCode }) => isoCode);

const resour = locales.reduce(
  (acc, { isoCode, resource }) => ({ ...acc, ...{ [isoCode]: resource } }),
  {},
);

function normalizeLanguage(lang) {
  const normalizedLang = (lang || "").toLowerCase();
  const primaryLang = normalizedLang.split("-")[0];

  if (supportedLanguages.includes(normalizedLang)) {
    return normalizedLang;
  }

  if (supportedLanguages.includes(primaryLang)) {
    return primaryLang;
  }

  return "en";
}

const i18nextOptions = {
  supportedLngs: supportedLanguages,
  fallbackLng: "en",
  lng: normalizeLanguage(
    typeof navigator !== "undefined" ? navigator.language : undefined,
  ),
  debug: true,
  resources: resour,
};

const initI18n = i18next.use(LanguageDetector).init(i18nextOptions);
const localize = locI18next.init(i18next);
const localizeKey = i18next.t;

function getCurrentLanguage() {
  return normalizeLanguage(i18next.resolvedLanguage || i18next.language || "en");
}

function LangSelector() {
  return (
    <span id="langSelector" className="dropdown">
      <button
        className="btn btn-primary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
      >
        <img src={iconTranslate} style={{ height: "1.4em" }} />
        <span className="translate" data-i18n="language">
          Language
        </span>
      </button>

      <ul className="dropdown-menu">
        {langList.map((d) => (
          <li key={d.isoCode}>
            <a
              href="#"
              className="dropdown-item"
              onClick={(ev) => {
                ev.preventDefault();
                i18next
                  .changeLanguage(d.isoCode)
                  .then(() => localize(".translate"))
                  .catch((reason) => {});

                const currentLang = normalizeLanguage(d.isoCode);
                window.corpusText =
                  corpora.filter((d) => d.language === currentLang)[0]?.text ??
                  corpora[0]?.text ??
                  "";

                window.w2v.dispose();
                window.w2v = new Word2Vector(window.corpusText);
                window.w2v.initNetwork();
              }}
            >
              {d.endonym}
            </a>
          </li>
        ))}
      </ul>
    </span>
  );
}

export {
  LangSelector,
  getCurrentLanguage,
  initI18n,
  localize,
  localizeKey,
  normalizeLanguage,
};
