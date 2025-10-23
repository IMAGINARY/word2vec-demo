import { NeuralNetwork } from "./NeuralNetwork.ts";
import { NeuralNetworkVisualization } from "./nnViz.ts";
import { VectorVisualization } from "./vectorViz.js";
import { ErrorChart, visualizeError } from "./errorViz.js";
import { TextVisualization } from "./textViz.js";

const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const tokenize = (text: string) =>
  text
    // .replace(/\./g, " .")
    // .replace(",", " ,")
    // .replace("!", " !")
    // .replace("?", " ?")
    // .replace(/\n/g, " ")
    // .replace(/  /g, " ")
    .split(" ")
    .filter((v, i, a) => v != "");

console.log(tokenize("This is a      sample. This, sample is simple!"));

interface Word2Vector {
  corpus: string; // string with the cleaned text
  corpusTokens: string[]; // array of words
  tokens: string[]; // array of unique words in the corpus
  vectors: { [key: string]: number[] }; // dictionary {token: vector} of sparse vectors with one-hot-encoding
  oneHotSize: number; // size of one-hot vectors
  data: { x: string; y: string[] }[]; // array of pairs {x,y}, where x is a word and y is an array of two words.
  nn: NeuralNetwork;
  nnViz: NeuralNetworkVisualization;
  vecViz: VectorVisualization;
  errViz: ErrorChart;
  textViz: TextVisualization;
  currentDataPoint: number;
  currentEpoch: number;
  currentEpochError: number;
  autoTrainingMode: boolean;
  initNetwork(): void;
  trainDataPoint(): void;
  train(): Promise<void>;
  pause(): void;
  reset(): void;
  dispose(): void;
  getTrainingData(
    corpusTokens: string[],
    halfWinSize?: number
  ): { x: string; y: string[] }[];
  getOneHotVector(tokens: string[]): { [key: string]: number[] };
}

class Word2Vector {
  constructor(corpus: string) {
    console.log("Constructing w2v...");
    this.corpus = corpus;
    this.corpusTokens = tokenize(corpus); // corpus split into words/tokens
    this.tokens = this.corpusTokens.filter((v, i, a) => a.indexOf(v) === i); // unique tokens

    this.vectors = this.getOneHotVector(this.tokens);
    this.data = this.getTrainingData(this.corpusTokens);

    console.log("Corpus: ", this.corpus);
    console.log("corpusTokens: ", this.corpusTokens);
    console.log("Tokens: ", this.tokens);
    console.log("Vectors: ", this.vectors);
    console.log("OneHotSize: ", this.oneHotSize);
    console.log("Training data: ", this.data);

    this.nn = new NeuralNetwork(this.oneHotSize);
    this.nnViz = new NeuralNetworkVisualization(this.nn);
    this.vecViz = new VectorVisualization(this.nn);
    this.errViz = new ErrorChart();
    this.textViz = new TextVisualization(this.corpus);

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
    console.log("Done initializing network.");
  }

  trainDataPoint() {
    const iter = 20;

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
      const avgErrors = this.currentEpochError / this.data.length;
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

  async train() {
    this.autoTrainingMode = true;
    while (this.autoTrainingMode) {
      this.trainDataPoint();
      await sleep(65);
    }
  }

  pause() {
    this.autoTrainingMode = false;
  }

  reset() {
    console.log("Resetting...");
    this.autoTrainingMode = false;

    this.nnViz.dispose();
    this.nnViz = new NeuralNetworkVisualization(this.nn);

    this.vecViz.dispose();
    this.vecViz = new VectorVisualization(this.nn);

    this.errViz.dispose();
    this.errViz = new ErrorChart();

    this.textViz.dispose();
    this.textViz = new TextVisualization(this.corpus);
    this.initNetwork();
  }

  dispose() {
    console.log("Disposing w2v...");
    this.autoTrainingMode = false;

    this.nnViz.dispose();
    this.vecViz.dispose();
    this.errViz.dispose();
    this.textViz.dispose();
  }

  getTrainingData(corpusTokens: string[], halfWinSize = 1) {
    let data = [] as { x: string; y: string[] }[];
    for (let i = 0; i < corpusTokens.length; i++) {
      let tmp = { x: "", y: [] as string[] };
      for (let j = i - halfWinSize; j < i + halfWinSize + 1; j++) {
        if (j < 0 || j >= corpusTokens.length) {
          tmp.y.push("");
        } else if (j == i) {
          tmp.x = corpusTokens[j];
        } else {
          tmp.y.push(corpusTokens[j]);
        }
      }
      data.push(tmp);
    }
    return data;
  }

  getOneHotVector(tokens: string[]) {
    const total = tokens.length;
    console.log(`Number of unique tokens in corpus: ${total}`);
    // console.log(tokens);
    this.oneHotSize = total + 1;
    let oneHotVectors = {} as { [key: string]: number[] };
    for (let i = 0; i < total + 1; i++) {
      let vector = Array(total + 1).fill(0);
      vector[i] = 1;
      if (i == total) {
        oneHotVectors[""] = vector;
      } else {
        oneHotVectors[tokens[i]] = vector;
      }
    }

    return oneHotVectors;
  }
}

export { Word2Vector };
