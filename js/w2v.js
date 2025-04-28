import { NeuralNetwork } from "./NeuralNetwork.js";
import { NeuralNetworkVisualization } from "./nnViz.js";

class Word2Vector {
  constructor() {
    // this.corpus = clean($("#article").text());
    // console.log(this.corpus);
    // this.vectors = getOneHotVector(corpus);

    this.nn = new NeuralNetwork(15);
    this.nnViz = new NeuralNetworkVisualization(this.nn);
  }

  initNetwork = function () {
    console.log("Initializing network");
    this.corpus = clean($("#article").text());
    // console.log(corpus);
    this.vectors = getOneHotVector(this.corpus);
    this.data = getTrainingData(this.corpus);

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
  };

  train = async function (iter = 20) {
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

        inputLayer = this.nn.inputLayer;
        hiddenLayer = this.nn.hiddenLayer;
        outputLayer = this.nn.outputLayer;
        firstEdges = this.nn.firstEdges;
        secondEdges = this.nn.secondEdges;

        this.nnViz.update(this.data[i].x, this.data[i].y[0], this.data[i].y[1]);

        const index = Object.keys(this.vectors).indexOf(this.data[i].x);
        redrawPositions(index, this.data[i].x);

        highlightWords(this.data[i].x, this.data[i].y[0], this.data[i].y[1]);
        await sleep(65);
      }
      const avgErrors = errors / parseFloat(this.data.length);
      visualizeError(it + 1, iter, avgErrors);
      updateCharts(it + 1, avgErrors);
      console.log(`Errors in ${it} epoch: ${avgErrors}`);
    }

    runRotation();
  };
}

const w2v = new Word2Vector();

///////

const oneHotSize = 15; // TO FIX.

var inputLayer = Array(oneHotSize).fill(0.0);
var hiddenLayer = Array(3).fill(0.0);
var outputLayer = Array(30).fill(0.0);

var firstEdges = Array(inputLayer.length * hiddenLayer.length).fill({});
var secondEdges = Array(hiddenLayer.length * outputLayer.length).fill({});

$("#nn_errors").width = $("#article").width();
$("#nn_errors").height = $("#article").width();
let chart = new Chart($("#nn_errors"), {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Error",
        data: [],
        backgroundColor: "#ADD7F6",
        borderColor: "#0275D8",
        borderWidth: 1,
        fill: false,
      },
    ],
  },
  options: {
    elements: {
      line: {
        tension: 0,
      },
    },
  },
});

var trace = {
  x: Array(oneHotSize).fill(0.0),
  y: Array(oneHotSize).fill(0.0),
  z: Array(oneHotSize).fill(0.0),
  text: Array(oneHotSize).fill(""),
  mode: "markers",
  marker: {
    size: 5,
    line: {
      color: "rgba(217, 217, 217, 0.14)",
      width: 0.5,
    },
    color: "#84DCC6",
    opacity: 0.8,
  },
  type: "scatter3d",
};

const layout = {
  dragmode: true,
  height: $("#article").width(),
  width: $("#article").width(),
  margin: { l: 0, r: 0, b: 0, t: 0 },
  scene: {
    camera: {
      eye: { x: 1, y: 1, z: 1 },
    },
  },
};

let divPos = document.getElementById("positions");
Plotly.newPlot(divPos, [trace], layout, { displayModeBar: false });

function updateCharts(iter, errors) {
  chart.data.labels.push(iter);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(errors);
  });
  chart.update();
}

/* Corpus text visualization */

function highlightWords(x, y1, y2) {
  let corpus = $("#article").html();
  let tmp = corpus.split("<b>");

  tmp[0] = tmp[0].replace(/<[^>]*>?/gm, "");
  tmp[1] = tmp[1].replace(/<[^>]*>?/gm, "");

  if (y1 == "") {
    tmp[0] = tmp[0].replace(`${x} ${y2}`, `<b>${x} ${y2}</b>`);
  } else if (y2 == "") {
    tmp[1] = tmp[1].replace(`${y1} ${x}`, `<b>${y1} ${x}</b>`);
  } else {
    tmp[1] = tmp[1].replace(`${y1} ${x} ${y2}`, `<b>${y1} ${x} ${y2}</b>`);
  }

  $("#article").html(tmp[0] + tmp[1]);
}

function redrawPositions(idx, text) {
  trace.x[idx] = hiddenLayer[0];
  trace.y[idx] = hiddenLayer[1];
  trace.z[idx] = hiddenLayer[2];
  trace.text[idx] = text;
  Plotly.redraw("positions");
}

/*  Word2Vec data preparation */

function clean(text) {
  // corpus = corpus.replace(/\n/g, ' ');
  // corpus = corpus.replace(/  /g, '');
  // corpus = corpus.replace(/\./g, '');
  // corpus = corpus.replace(/,/g, '');

  return text.split(" ").filter((v, i, a) => v != "");
}

function getTrainingData(corpus, halfWinSize = 1) {
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

function getOneHotVector(corpus) {
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

/* Error graph visualization */

function visualizeError(iter, total_iter, errors) {
  $("#w2v_epoch").text(`epoch: ${iter} / ${total_iter}, error: ${errors}`);
}

/* 3D visualization */

function runRotation() {
  rotate("scene", Math.PI / 1440);
  requestAnimationFrame(runRotation);
}

function rotate(id, angle) {
  var eye0 = divPos.layout[id].camera.eye;
  var rtz = xyz2rtz(eye0);
  rtz.t += angle;

  var eye1 = rtz2xyz(rtz);
  Plotly.relayout(divPos, id + ".camera.eye", eye1);
}

function xyz2rtz(xyz) {
  return {
    r: Math.sqrt(xyz.x * xyz.x + xyz.y * xyz.y),
    t: Math.atan2(xyz.y, xyz.x),
    z: xyz.z,
  };
}

function rtz2xyz(rtz) {
  return {
    x: rtz.r * Math.cos(rtz.t),
    y: rtz.r * Math.sin(rtz.t),
    z: rtz.z,
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { w2v };
