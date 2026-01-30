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
} from "../js/locales/text-assets";

export function App() {
  const [Lang, setLang] = useState(""); // Language
  const [Corpus, setCorpus] = useState(""); // Text corpus
  const [Tokens, setTokens] = useState(""); // Tokenization of corpus. Array of words.
  const [Vectors, setVectors] = useState(""); // One-hot-encoding vectors.
  const [TrainingData, setTrainingData] = useState(""); // Training data pairs {x,y} x is a word, y is an array of two words.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aboutHtml, setAboutHtml] = useState("");

  useEffect(() => {
    const aboutAssets = {
      en: about_en,
      de: about_de,
      es: about_es,
      fr: about_fr,
    };

    const loadAboutHtml = async (lang) => {
      const normalizedLang = (lang || "").toLowerCase();
      const primaryLang = normalizedLang.split("-")[0];
      const aboutUrl =
        aboutAssets[normalizedLang] ||
        aboutAssets[primaryLang] ||
        aboutAssets.en;

      try {
        const response = await fetch(aboutUrl);
        const html = await response.text();
        setAboutHtml(html);
      } catch (error) {
        setAboutHtml("");
      }
    };

    void loadAboutHtml(i18next.resolvedLanguage || i18next.language || "en");
    const handleLanguageChange = (nextLang) => {
      void loadAboutHtml(nextLang);
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
                  className="btn btn-primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  About
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
    </>
  );
}
