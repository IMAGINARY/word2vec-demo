import "bootstrap";
import locales from "../js/locales/locales";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import locI18next from "loc-i18next";
import { Word2Vector } from "../js/w2v.ts";

// Filter here the languages to appear in the UI.
const langList = locales
  .map(({ isoCode, endonym }) => ({ isoCode, endonym }))
  .filter((d) => ["en", "es"].includes(d.isoCode));

const iconTranslate = new URL("../img/translate.svg", import.meta.url).href;

const resour = locales.reduce(
  (acc, { isoCode, resource }) => ({ ...acc, ...{ [isoCode]: resource } }),
  {}
);

const i18nextOptions = {
  supportedLngs: langList.map(({ isoCode }) => isoCode),
  fallbackLng: "en",
  // fallbackLng: 'false',
  debug: true,
  resources: resour,
};

void i18next.use(LanguageDetector).init(i18nextOptions);
const localize = locI18next.init(i18next);
const localizeKey = i18next.t;

function LangSelector() {
  return (
    <span id="langSelector" className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
      >
        <img src={iconTranslate} style={{ height: "1.4em" }} />
      </button>

      <ul className="dropdown-menu">
        {langList.map((d) => (
          <li key={d.isoCode}>
            <a
              href="#"
              className="dropdown-item"
              onClick={(ev) => {
                i18next
                  .changeLanguage(d.isoCode)
                  .then(() => localize(".translate"))
                  .catch((reason) => {});

                window.w2v.dispose();
                window.w2v = new Word2Vector(i18next.t("corpusText"));
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

export { LangSelector, localize, localizeKey };
