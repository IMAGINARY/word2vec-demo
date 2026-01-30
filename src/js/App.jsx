import { useEffect, useState } from "react";
import ErrorVisualization from "../components/errorViz";
import NeuralNetworkVisualization from "../components/nnViz";
import TextVisualization from "../components/textViz";
import VectorVisualization from "../components/vectorViz";
import { LangSelector } from "../components/langSelector";
import { CorpusSelector } from "../components/corpusSelector";
import Modal from "../components/modal";
import i18next from "i18next";
import {
  about_de,
  about_en,
  about_es,
  about_fr,
  about_uk,
  info_de,
  info_en,
  info_es,
  info_fr,
  info_uk,
} from "../js/locales/text-assets";

export function App() {
  const [Lang, setLang] = useState(""); // Language
  const [Corpus, setCorpus] = useState(""); // Text corpus
  const [Tokens, setTokens] = useState(""); // Tokenization of corpus. Array of words.
  const [Vectors, setVectors] = useState(""); // One-hot-encoding vectors.
  const [TrainingData, setTrainingData] = useState(""); // Training data pairs {x,y} x is a word, y is an array of two words.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aboutHtml, setAboutHtml] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoHtml, setInfoHtml] = useState("");

  useEffect(() => {
    const aboutAssets = {
      en: about_en,
      de: about_de,
      es: about_es,
      fr: about_fr,
      uk: about_uk,
    };
    const infoAssets = {
      en: info_en,
      de: info_de,
      es: info_es,
      fr: info_fr,
      uk: info_uk,
    };

    const loadHtml = async (lang, assets, setHtml) => {
      const normalizedLang = (lang || "").toLowerCase();
      const primaryLang = normalizedLang.split("-")[0];
      const assetUrl =
        assets[normalizedLang] || assets[primaryLang] || assets.en;

      try {
        const response = await fetch(assetUrl);
        const html = await response.text();
        setHtml(html);
      } catch (error) {
        setHtml("");
      }
    };

    const loadAllHtml = (lang) => {
      void loadHtml(lang, aboutAssets, setAboutHtml);
      void loadHtml(lang, infoAssets, setInfoHtml);
    };

    loadAllHtml(i18next.resolvedLanguage || i18next.language || "en");
    const handleLanguageChange = (nextLang) => {
      loadAllHtml(nextLang);
    };

    i18next.on("languageChanged", handleLanguageChange);
    return () => {
      i18next.off("languageChanged", handleLanguageChange);
    };
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 left-column">
            <div className="panel panel-primary">
              <div className="panel-heading translate" data-i18n="tdSettings">
                Settings
              </div>
              <div className="panel-body button-group" id="panel-settings">
                <LangSelector />
                <CorpusSelector />
                <button
                  type="button"
                  className="btn btn-primary translate"
                  onClick={() => setIsModalOpen(true)}
                  data-i18n="about"
                >
                  About
                </button>
                <button
                  type="button"
                  className="btn btn-primary translate"
                  onClick={() => setIsInfoOpen(true)}
                  data-i18n="info"
                >
                  Info
                </button>
              </div>
            </div>
            <TextVisualization />
            <ErrorVisualization />
          </div>

          <div className="col-md-4">
            <NeuralNetworkVisualization />
          </div>

          <div className="col-md-5">
            <VectorVisualization />
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={null}
      >
        <div dangerouslySetInnerHTML={{ __html: aboutHtml }} />
      </Modal>
      <Modal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} title={null}>
        <div dangerouslySetInnerHTML={{ __html: infoHtml }} />
      </Modal>
    </>
  );
}
