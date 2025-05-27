import "bootstrap";
import * as d3 from "d3";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import locI18next from "loc-i18next";

import locales from "./locales/locales";
import { Word2Vector } from "./w2v";

const iconTranslate = new URL("../img/translate.svg", import.meta.url).href;

// Filter here the languages to appear in the UI.
const langList = locales
  .map(({ isoCode, endonym }) => ({ isoCode, endonym }))
  .filter((d) => ["en", "fr"].includes(d.isoCode));

const resourcesGraphs_en = {}; //as { [key: string]: string };
const resourcesGraphs_fr = {}; //as { [key: string]: string };
const resourcesGraphs_de = {}; //as { [key: string]: string };

const resour = locales.reduce(
  (acc, { isoCode, resource }) => ({ ...acc, ...{ [isoCode]: resource } }),
  {}
);
//  as {
//   en: { translation: { [key: string]: string } };
//   fr: { translation: { [key: string]: string } };
//   de: { translation: { [key: string]: string } };
// };

// graphGalleryList.forEach((d) => {
//   resourcesGraphs_en[d.file] = d.name_en; //as string;
//   resourcesGraphs_fr[d.file] = d.name_fr; //as string;
//   resourcesGraphs_de[d.file] = d.name_de; //as string;
// });

// resour.en.translation = { ...resour.en.translation, ...resourcesGraphs_en };
// resour.fr.translation = { ...resour.fr.translation, ...resourcesGraphs_fr };
// resour.de.translation = { ...resour.de.translation, ...resourcesGraphs_de };

const i18nextOptions = {
  supportedLngs: langList.map(({ isoCode }) => isoCode),
  fallbackLng: "en",
  // fallbackLng: 'false',
  debug: true,
  resources: resour,
};

/** Translation setup */

// eslint-disable-next-line no-void
void i18next.use(LanguageDetector).init(i18nextOptions);
const localize = locI18next.init(i18next);

// Make Language Selector

/** Create the language selector button
 * @returns HTMLSpanElement container
 */
function createLangSelector() {
  // const divLangSelector = d3.select('#langSelector').classed('dropdown', true);
  const container = document.createElement("span");
  const divLangSelector = d3.select(container).classed("dropdown", true);

  divLangSelector
    .append("button")
    .attr("class", "btn btn-secondary dropdown-toggle")
    .attr("type", "button")
    .attr("data-bs-toggle", "dropdown")
    .append("img")
    .attr("src", iconTranslate)
    .style("height", "1.4em");
  // .attr('width', '30px');

  divLangSelector.append("ul").classed("dropdown-menu", true);

  divLangSelector
    .select(".dropdown-menu")
    .selectAll("li")
    .data(langList)
    .enter()
    .append("li")
    .append("a")
    .classed("dropdown-item", true)
    .attr("href", "#")
    .on("click", (ev, d) => {
      i18next
        .changeLanguage(d.isoCode)
        .then(() => localize(".translate"))
        .catch((reason) => {
          // TODO: Handle the error properly instead of ignoring it.
          // eslint-disable-next-line no-console
          console.error(`Changing to language ${d.isoCode} failed.`, reason);
        });
      //   window.localizeBlocks();
      console.log(i18next.t("corpusText"));
      window.w2v.dispose();
      window.w2v = new Word2Vector(i18next.t("corpusText"));
      window.w2v.initNetwork();
    })
    .text((d) => d.endonym);
  return container;
}

export { createLangSelector, localize };
