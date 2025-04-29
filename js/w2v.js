import { NeuralNetwork } from "./NeuralNetwork.js";
import { NeuralNetworkVisualization } from "./nnViz.js";
import { VectorVisualization } from "./vectorViz.js";
import { ErrorChart, visualizeError } from "./errorViz.js";
import { highlightWords } from "./textViz.js";

const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Word2Vector {
  constructor() {
    // this.corpus = clean($("#article").text());
    // console.log(this.corpus);
    // this.vectors = getOneHotVector(corpus);

    // const oneHotSize = 15; // TO FIX.

    this.nn = new NeuralNetwork(15);
    this.nnViz = new NeuralNetworkVisualization(this.nn);
    this.vecViz = new VectorVisualization(this.nn);
    this.errViz = new ErrorChart();
  }

  initNetwork() {
    console.log("Initializing network");
    this.corpus = this.clean($("#article").text());
    // console.log(corpus);
    this.vectors = this.getOneHotVector(this.corpus);
    this.data = this.getTrainingData(this.corpus);

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
  }

  async train(iter = 20) {
    $("#w2v_training").prop("disabled", true);

    console.log("Corpus: ", this.corpus);
    console.log("Vectors: ", this.vectors);
    console.log("Data: ", this.data);

    for (var it = 0; it < iter; it++) {
      var errors = 0.0;
      for (var i = 0; i < this.data.length; i++) {
        this.nn.feedforward(this.vectors[this.data[i].x]);
        const y = this.vectors[this.data[i].y[0]].concat(
          this.vectors[this.data[i].y[1]]
        );
        errors += this.nn.backpropagate(y);

        this.nnViz.update(this.data[i].x, this.data[i].y[0], this.data[i].y[1]);

        const index = Object.keys(this.vectors).indexOf(this.data[i].x);
        this.vecViz.redrawPositions(index, this.data[i].x);

        highlightWords(this.data[i].x, this.data[i].y[0], this.data[i].y[1]);
        await sleep(65);
      }
      const avgErrors = errors / parseFloat(this.data.length);
      visualizeError(it + 1, iter, avgErrors);
      this.errViz.updateCharts(it + 1, avgErrors);
      console.log(`Errors in ${it} epoch: ${avgErrors}`);
    }

    this.vecViz.runRotation();
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

  clean(text) {
    // corpus = corpus.replace(/\n/g, ' ');
    // corpus = corpus.replace(/  /g, '');
    // corpus = corpus.replace(/\./g, '');
    // corpus = corpus.replace(/,/g, '');

    return text.split(" ").filter((v, i, a) => v != "");
  }

  getOneHotVector(corpus) {
    const unique = corpus.filter((v, i, a) => a.indexOf(v) === i);
    const total = unique.length;
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
