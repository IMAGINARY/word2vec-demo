import { useState } from "react";
import ErrorVisualization from "../components/errorViz";
import NeuralNetworkVisualization from "../components/nnViz";
import TextVisualization from "../components/textViz";
import VectorVisualization from "../components/vectorViz";

export function App() {
  const [Lang, setLang] = useState(""); // Language
  const [Corpus, setCorpus] = useState(""); // Text corpus
  const [Tokens, setTokens] = useState(""); // Tokenization of corpus. Array of words.
  const [Vectors, setVectors] = useState(""); // One-hot-encoding vectors.
  const [TrainingData, setTrainingData] = useState(""); // Training data pairs {x,y} x is a word, y is an array of two words.

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
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
    </>
  );
}
