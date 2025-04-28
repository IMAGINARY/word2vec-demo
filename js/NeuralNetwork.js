class NeuralNetwork {
  constructor(inputSize) {
    console.log("Initializing Neural Network");
    console.log("inputSize: ", inputSize);
    this.oneHotSize = inputSize;

    this.inputLayer = new Array(inputSize).fill(0.0);
    this.hiddenLayer = new Array(3).fill(0.0);
    this.outputLayer = new Array(30).fill(0.0);

    this.firstEdges = Array(
      this.inputLayer.length * this.hiddenLayer.length
    ).fill({});
    this.secondEdges = Array(
      this.hiddenLayer.length * this.outputLayer.length
    ).fill({});

    this.firstMatrix = [...Array(this.inputLayer.length)].map((x) =>
      Array(this.hiddenLayer.length).fill(0)
    );
    this.secondMatrix = [...Array(this.hiddenLayer.length)].map((x) =>
      Array(this.outputLayer.length).fill(0)
    );

    this.prevFirstMatrix = [...Array(this.inputLayer.length)].map((x) =>
      Array(this.hiddenLayer.length).fill(0)
    ); //last change in weights for momentum
    this.prevSecondMatrix = [...Array(this.hiddenLayer.length)].map((x) =>
      Array(this.outputLayer.length).fill(0)
    ); //last change in weights for momentum
  }

  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  dsigmoid(y) {
    return y * (1 - y);
  }

  // function dsoftmax(arr) {
  //   let len = arr.length;
  //   let result = new Array(len);
  //   for(let i = 0; i < len; i++) {
  //     result[i] = new Array(len);
  //   }
  //   for(let i = 0; i < len; i++) {
  //     for(let j = 0; j < len; j++) {
  //       if(i === j) {
  //         result[i][j] = arr[i] * (1 - arr[i]);
  //       } else {
  //         result[i][j] = - arr[i] * arr[j];
  //       }
  //     }
  //   }
  //   return result;
  // }

  feedforward(x) {
    x.forEach((e, i) => {
      this.inputLayer[i] = e;
    });

    for (var i = 0; i < this.hiddenLayer.length; i++) {
      var sum = 0.0;
      for (var j = 0; j < this.inputLayer.length; j++) {
        sum += this.inputLayer[j] * this.firstMatrix[j][i];
      }
      this.hiddenLayer[i] = this.sigmoid(sum);
    }

    // Use sigmoid instead
    // for (var i=0; i<this.outputLayer.length; i++) {
    //   var sum = 0.0;
    //   for (var j=0; j<this.hiddenLayer.length; j++) {
    //     sum += this.hiddenLayer[j] * this.secondMatrix[j][i];
    //   }
    //   this.outputLayer[i] = sigmoid(sum);
    // }

    // do softmax
    var tmp1st = [];
    var tmp2nd = [];
    for (var i = 0; i < this.outputLayer.length; i++) {
      var sum = 0.0;
      for (var j = 0; j < this.hiddenLayer.length; j++) {
        sum += this.hiddenLayer[j] * this.secondMatrix[j][i];
      }

      if (i < this.oneHotSize) {
        tmp1st.push(sum);
      } else {
        tmp2nd.push(sum);
      }
    }

    const res1st = this.softmax(tmp1st);
    const res2nd = this.softmax(tmp2nd);
    for (var i = 0; i < this.outputLayer.length; i++) {
      if (i < this.oneHotSize) {
        this.outputLayer[i] = res1st[0][i] / res1st[1];
      } else {
        this.outputLayer[i] = res2nd[0][i - this.oneHotSize] / res2nd[1];
      }
    }
    console.log(
      `The sum of 2 softmax result is ${this.outputLayer.reduce(
        (partialSum, x) => partialSum + x,
        0.0
      )}`
    );
  }

  softmax(tmp) {
    tmp = tmp.map((x) => {
      const exp = Math.exp(x);
      return exp == Infinity ? Number.MAX_VALUE : exp;
    });

    var expSum = tmp.reduce((partialSum, x) => partialSum + x, 0.0);
    expSum = expSum == Infinity ? Number.MAX_VALUE : expSum;

    return [tmp, expSum];
  }

  backpropagate(y, N = 0.75, M = 0.1) {
    var outputDeltas = Array(this.outputLayer.length).fill(0.0);
    var totalErrors = 0.0;
    y.forEach((ele, index) => {
      const error = ele - this.outputLayer[index];
      totalErrors += Math.sqrt(Math.pow(error, 2));

      // outputDeltas[index] = error * dsigmoid(this.outputLayer[index]);
      outputDeltas[index] = error;
    });

    // The source code of word2vec does not do dsoftmax
    // var softmaxDerivative = dsoftmax(this.outputLayer);
    // var gradient = Array(outputDeltas.length).fill(0.0);
    // for (var i=0; i<softmaxDerivative.length; i++) {
    //   for (var j=0; j<softmaxDerivative[i].length; ++j) {
    //     gradient[i] += outputDeltas[i] * softmaxDerivative[i][j];
    //   }
    // }

    // console.log(gradient);

    var hiddenDeltas = Array(this.hiddenLayer.length).fill(0.0);
    for (var i = 0; i < this.hiddenLayer.length; i++) {
      var error = 0.0;
      for (var j = 0; j < this.outputLayer.length; j++) {
        // error += gradient[j] * this.secondMatrix[i][j];
        error += outputDeltas[j] * this.secondMatrix[i][j];
      }

      hiddenDeltas[i] = this.dsigmoid(this.hiddenLayer[i]) * error;
    }

    for (var i = 0; i < this.hiddenLayer.length; i++) {
      for (var j = 0; j < this.outputLayer.length; j++) {
        const change = outputDeltas[j] * this.hiddenLayer[i];

        const index = this.secondEdges.findIndex(
          (edge) => edge.i === i && edge.j === j
        );
        this.secondEdges[index].weight +=
          N * change + M * this.prevSecondMatrix[i][j];

        this.secondMatrix[i][j] += N * change + M * this.prevSecondMatrix[i][j];
        this.prevSecondMatrix[i][j] = change;
      }
    }

    for (var i = 0; i < this.inputLayer.length; i++) {
      for (var j = 0; j < this.hiddenLayer.length; j++) {
        const change = hiddenDeltas[j] * this.inputLayer[i];

        const index = this.firstEdges.findIndex(
          (edge) => edge.i === i && edge.j === j
        );
        this.firstEdges[index].weight +=
          N * change + M * this.prevFirstMatrix[i][j];

        this.firstMatrix[i][j] += N * change + M * this.prevFirstMatrix[i][j];
        this.prevFirstMatrix[i][j] = change;
      }
    }

    return totalErrors / parseFloat(y.length);
  }
}

export { NeuralNetwork };
