import { NeuralNetwork } from "./NeuralNetwork.js";
import { NeuralNetworkVisualization } from "./nnViz.js";
import { VectorVisualization } from "./vectorViz.js";
import { ErrorChart, visualizeError } from "./errorViz.js";
import { TextVisualization } from "./textViz.js";

const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const tokenize = (text) => {
  // corpus = corpus.replace(/\n/g, ' ');
  // corpus = corpus.replace(/  /g, '');
  // corpus = corpus.replace(/\./g, '');
  // corpus = corpus.replace(/,/g, '');

  return text.split(" ").filter((v, i, a) => v != "");
};

/*
text: string with the cleaned text
corpus: array of words
vectors: sparse vectors with one-hot-encoding
data: array of pairs {x,y}, where x is a word and y is an array of two words.
*/

class Word2Vector {
  constructor(sourceText) {
    console.log("Constructing w2v...");
    this.sourceText = sourceText;
    this.corpus = tokenize(sourceText); // split into words/tokens
    this.vectors = this.getOneHotVector(this.corpus);
    this.data = this.getTrainingData(this.corpus);

    console.log("Corpus: ", this.corpus);
    console.log("Vectors: ", this.vectors);
    console.log("OneHotSize: ", this.oneHotSize);
    console.log("Training data: ", this.data);

    // console.log(this.oneHotSize);

    this.nn = new NeuralNetwork(this.oneHotSize);
    this.nnViz = new NeuralNetworkVisualization(this.nn);
    this.vecViz = new VectorVisualization(this.nn);
    this.errViz = new ErrorChart();
    this.textViz = new TextVisualization(this.sourceText);

    console.log("Done constructing w2v.");
  }

  initNetwork() {
    console.log("Initializing network...");

    for (var x = 0; x < this.nn.inputLayer.length; x++) {
      for (var y = 0; y < this.nn.hiddenLayer.length; y++) {
        const w = Math.random();
        this.nn.firstEdges[x * this.nn.hiddenLayer.length + y] = {
          i: x,
          j: y,
          weight: w,
        };
        this.nn.firstMatrix[x][y] = w;
      }
    }

    for (var x = 0; x < this.nn.hiddenLayer.length; x++) {
      for (var y = 0; y < this.nn.outputLayer.length; y++) {
        const w = Math.random();
        this.nn.secondEdges[x * this.nn.outputLayer.length + y] = {
          i: x,
          j: y,
          weight: w,
        };
        this.nn.secondMatrix[x][y] = w;
      }
    }
    this.currentDataPoint = 0;
    this.currentEpoch = 0;
    this.currentEpochError = 0.0;
  }

  trainDataPoint() {
    const iter = 20;
    // document.getElementById("w2v_training").disabled = true;

    this.nn.feedforward(this.vectors[this.data[this.currentDataPoint].x]);

    const y = this.vectors[this.data[this.currentDataPoint].y[0]].concat(
      this.vectors[this.data[this.currentDataPoint].y[1]]
    );

    this.currentEpochError += this.nn.backpropagate(y);

    this.nnViz.update(
      this.data[this.currentDataPoint].x,
      this.data[this.currentDataPoint].y[0],
      this.data[this.currentDataPoint].y[1]
    );

    const index = Object.keys(this.vectors).indexOf(
      this.data[this.currentDataPoint].x
    );
    this.vecViz.redrawPositions(index, this.data[this.currentDataPoint].x);

    this.textViz.highlightWords(
      this.data[this.currentDataPoint].x,
      this.data[this.currentDataPoint].y[0],
      this.data[this.currentDataPoint].y[1]
    );

    this.currentDataPoint += 1;
    if (this.currentDataPoint >= this.data.length) {
      const avgErrors = this.currentEpochError / parseFloat(this.data.length);
      visualizeError(this.currentEpoch + 1, iter, avgErrors);
      this.errViz.updateCharts(this.currentEpoch + 1, avgErrors);
      console.log(`Errors in ${this.currentEpoch} epoch: ${avgErrors}`);

      this.currentDataPoint = 0;
      this.currentEpoch += 1;
      this.currentEpochError = 0.0;
    }

    if (this.currentEpoch >= iter) {
      this.autoTrainingMode = false;
      this.vecViz.runRotation();
    }
  }

  async train(iter = 20) {
    document.getElementById("w2v_training").disabled = true;
    this.autoTrainingMode = true;

    while (this.autoTrainingMode) {
      this.trainDataPoint();
      await sleep(65);
    }
  }

  pause() {
    this.autoTrainingMode = false;
    document.getElementById("w2v_training").disabled = false;
  }

  reset() {
    console.log("Resetting...");
    this.autoTrainingMode = false;
    document.getElementById("w2v_training").disabled = false;

    this.nnViz.dispose();
    this.nnViz = new NeuralNetworkVisualization(this.nn);

    this.vecViz.dispose();
    this.vecViz = new VectorVisualization(this.nn);

    this.errViz.dispose();
    this.errViz = new ErrorChart();

    this.textViz.dispose();
    this.textViz = new TextVisualization(this.sourceText);
    this.initNetwork();
  }

  dispose() {
    console.log("Disposing w2v...");
    this.autoTrainingMode = false;
    document.getElementById("w2v_training").disabled = false;

    this.nnViz.dispose();
    this.vecViz.dispose();
    this.errViz.dispose();
    this.textViz.dispose();
  }
  getTrainingData(corpus, halfWinSize = 1) {
    let data = [];
    for (let i = 0; i < corpus.length; i++) {
      let tmp = { x: "", y: [] };
      for (let j = i - halfWinSize; j < i + halfWinSize + 1; j++) {
        if (j < 0 || j >= corpus.length) {
          tmp.y.push("");
        } else if (j == i) {
          tmp.x = corpus[j];
        } else {
          tmp.y.push(corpus[j]);
        }
      }
      data.push(tmp);
    }
    return data;
  }

  getOneHotVector(corpus) {
    const unique = corpus.filter((v, i, a) => a.indexOf(v) === i);
    const total = unique.length;
    console.log(`Number of unique tokens in corpus: ${total}`);
    // console.log(unique);
    this.oneHotSize = total + 1;
    let oneHotVectors = {};
    for (let i = 0; i < total + 1; i++) {
      let vector = Array(total + 1).fill(0);
      vector[i] = 1;
      if (i == total) {
        oneHotVectors[""] = vector;
      } else {
        oneHotVectors[unique[i]] = vector;
      }
    }

    return oneHotVectors;
  }
}

export { Word2Vector };
