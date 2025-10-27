import * as d3 from "d3";
import type { NeuralNetwork } from "./NeuralNetwork";

const scaleNeuron = d3.scaleLinear().domain([0.0, 1.0]).range([0, 255]);
const scaleEdge = d3.scaleLinear().domain([-5.5, 5.5]).range([0, 255]);
const r = 10;

interface NeuralNetworkVisualization {
  nn: NeuralNetwork;
  oneHotSize: number;
  width: number;
  height: number;
  status: string;
  nnSvg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  textInput: d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
  textOutput1: d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
  textOutput2: d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
  inputEdges: d3.Selection<SVGLineElement, any, any, any>;
  nnInputLabels: d3.Selection<SVGTextElement, any, any, any>;
  hiddenEdges: d3.Selection<SVGLineElement, any, any, any>;
  nnInput: d3.Selection<SVGCircleElement, any, any, any>;
  nnHidden: d3.Selection<SVGCircleElement, any, any, any>;
  nnOutput: d3.Selection<SVGCircleElement, any, any, any>;
  nnOutputTraining: d3.Selection<SVGCircleElement, any, any, any>;
  nnOutputLabels: d3.Selection<SVGTextElement, any, any, any>;
  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  dispose(): void;
  getPosY(i: number, len: number): number;
  update(x: string, y1: string, y2: string): void;
}

class NeuralNetworkVisualization {
  constructor(nn: NeuralNetwork, tokenLabels: string[]) {
    const labels = tokenLabels.concat(["[NULL]"]); // for padding token
    this.nn = nn;
    this.oneHotSize = this.nn.oneHotSize;
    this.width = 800;
    this.height = 976;

    this.status = "paused"; // training, prediction, paused

    const sizeOfText = 24;

    this.nnSvg = d3
      .select("div#w2v-vis")
      .append("div")
      .append("svg")
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .attr("style", "background-color: #ADD7F6; width:100%; height: auto;");

    this.textInput = this.nnSvg
      .append("g")
      .classed("input-text", true)
      .append("text")
      .attr("x", (1 / 5) * this.width)
      .attr("y", this.getPosY(0, 1) + sizeOfText / 2)
      .style("font-size", sizeOfText.toString() + "px")
      .style("color", "black")
      .style("text-anchor", "middle");

    this.textOutput1 = this.nnSvg
      .append("g")
      .classed("input-text", true)
      .append("text")
      .attr("x", (4 / 5) * this.width)
      .attr(
        "y",
        this.getPosY(this.oneHotSize / 2, this.oneHotSize * 2) + sizeOfText / 2
      )
      .style("font-size", sizeOfText.toString() + "px")
      .style("color", "black")
      .style("text-anchor", "middle");

    this.textOutput2 = this.nnSvg
      .append("g")
      .classed("input-text", true)
      .append("text")
      .attr("x", (4 / 5) * this.width)
      .attr(
        "y",
        this.getPosY(
          this.oneHotSize + this.oneHotSize / 2,
          this.oneHotSize * 2
        ) +
          sizeOfText / 2
      )
      .style("font-size", sizeOfText.toString() + "px")
      .style("color", "black")
      .style("text-anchor", "middle");

    this.inputEdges = this.nnSvg
      .selectAll("g.input-edge")
      .data(
        this.nn.firstMatrix.flatMap((row, i) =>
          row.map((weight, j) => ({ i, j, weight }))
        )
      )
      .enter()
      .append("g")
      .classed("input-edge", true)
      .classed("edge", true)
      .append("line")
      .attr("x1", (1 / 5) * this.width)
      .attr("y1", (d) => this.getPosY(d["i"], this.nn.inputLayer.length))
      .attr("x2", (2 / 5) * this.width)
      .attr("y2", (d) => this.getPosY(d["j"], this.nn.hiddenLayer.length))
      .attr("stroke", "#aaaaaa")
      .attr("stroke-width", 3);

    this.hiddenEdges = this.nnSvg
      .selectAll("g.hidden-edge")
      .data(
        this.nn.secondMatrix.flatMap((row, i) =>
          row.map((weight, j) => ({ i, j, weight }))
        )
      )
      .enter()
      .append("g")
      .classed("hidden-edge", true)
      .classed("edge", true)
      .append("line")
      .attr("x1", (2 / 5) * this.width)
      .attr("y1", (d) => this.getPosY(d["i"], this.nn.hiddenLayer.length))
      .attr("x2", (3 / 5) * this.width)
      .attr("y2", (d) => this.getPosY(d["j"], this.nn.outputLayer.length))
      .attr("stroke", "#aaaaaa")
      .attr("stroke-width", 3);

    this.nnInput = this.nnSvg
      .selectAll("g.input-neuron")
      .data(this.nn.inputLayer)
      .enter()
      .append("g")
      .classed("input-neuron", true)
      .classed("neuron", true)
      .append("circle")
      .attr("cx", (1 / 5) * this.width)
      .attr("cy", (d, i) => this.getPosY(i, this.nn.inputLayer.length))
      .attr("r", r);

    this.nnInputLabels = this.nnSvg
      .selectAll("g.input-neuron-label")
      .data(labels)
      .enter()
      .append("g")
      .classed("input-neuron-label", true)
      .append("text")
      .text((d) => d)
      .attr("x", (1 / 5) * this.width - r - 5)
      .attr("y", (d, i) => this.getPosY(i, this.nn.inputLayer.length) + 5)
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("color", "black");

    this.nnHidden = this.nnSvg
      .selectAll("g.hidden1-neuron")
      .data(this.nn.hiddenLayer)
      .enter()
      .append("g")
      .classed("hidden1-neuron", true)
      .classed("neuron", true)
      .append("circle")
      .attr("cx", (2 / 5) * this.width)
      .attr("cy", (d, i) => this.getPosY(i, this.nn.hiddenLayer.length))
      .attr("r", r)
      .on("mouseover", (d) => this.tooltip.style("visibility", "visible"))
      .on("mousemove", (ev, d) => {
        this.tooltip
          .text(d.toFixed(3))
          .style("top", ev.pageY - 10 + "px")
          .style("left", ev.pageX + 10 + "px");
      })
      .on("mouseout", (d) => {
        this.tooltip.style("visibility", "hidden");
      });

    this.nnOutput = this.nnSvg
      .selectAll("g.hidden2-neuron")
      .data(this.nn.outputLayer)
      .enter()
      .append("g")
      .classed("hidden2-neuron", true)
      .classed("neuron", true)
      .append("circle")
      .attr("cx", (3 / 5) * this.width)
      .attr("cy", (d, i) => this.getPosY(i, this.nn.outputLayer.length))
      .attr("r", r);

    this.nnOutputTraining = this.nnSvg
      .selectAll("g.hidden2-neuron-training")
      .data(this.nn.outputTraining)
      .enter()
      .append("g")
      .classed("hidden2-neuron-training", true)
      .classed("neuron", true)
      .append("circle")
      .attr("cx", (4 / 5) * this.width)
      .attr("cy", (d, i) => this.getPosY(i, this.nn.outputLayer.length))
      .attr("r", r);

    this.nnOutputLabels = this.nnSvg
      .selectAll("g.output-neuron-label")
      .data(labels.concat(labels))
      .enter()
      .append("g")
      .classed("output-neuron-label", true)
      .append("text")
      .text((d, i) => d)
      .attr("x", (3 / 5) * this.width + r + 5)
      .attr("y", (d, i) => this.getPosY(i, this.nn.outputLayer.length) + 5)
      .style("text-anchor", "start")
      .style("font-size", "12px")
      .style("color", "black");

    this.tooltip = d3
      .select("body")
      .append("div")
      .style("padding", "5px")
      .style("background-color", "#84DCC6")
      .style("color", "white")
      .style("font-size", "16px")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .text("");

    d3.selectAll(".edge line")
      .on("mouseover", () => {
        this.tooltip.style("visibility", "visible");
      })
      .on("mousemove", (ev, d: any) => {
        this.tooltip
          .text(d["weight"].toFixed(3))
          .style("top", ev.pageY - 10 + "px")
          .style("left", ev.pageX + 10 + "px");
      })
      .on("mouseout", (d) => {
        this.tooltip.style("visibility", "hidden");
      });

    d3.selectAll(".neuron circle")
      .on("mouseover", () => {
        this.tooltip.style("visibility", "visible");
      })
      .on("mousemove", (ev, d: any) => {
        return this.tooltip
          .text(d.toFixed(3))
          .style("top", ev.pageY - 10 + "px")
          .style("left", ev.pageX + 10 + "px");
      })
      .on("mouseout", (d) => {
        this.tooltip.style("visibility", "hidden");
      });

    // this.update();
  }

  dispose() {
    this.nnSvg.remove();
  }

  getPosY(i: number, len: number) {
    const mid = this.height / 2;
    const step = 15;
    const halfStep = step / 2;
    const numberOfNeuron = len / 2;
    const startPos =
      mid - ((numberOfNeuron + numberOfNeuron) * step + halfStep);
    return startPos + i * 2 * step;
  }

  update(x: string, y1: string, y2: string) {
    const sizeOfText = 24;
    const widthOfText = 100;

    this.textInput.text(x);
    this.textOutput1.text(y1);
    this.textOutput2.text(y2);

    this.nnInput.data(this.nn.inputLayer).style("fill", (d) => {
      const c = Math.round(scaleNeuron(d)).toString(16).padStart(2, "0");
      return "#" + c + c + c;
    });

    this.nnHidden.data(this.nn.hiddenLayer).style("fill", (d) => {
      const c = Math.round(scaleNeuron(d)).toString(16).padStart(2, "0");
      return "#" + c + c + c;
    });

    this.nnOutput.data(this.nn.outputLayer).style("fill", (d) => {
      const c = Math.round(scaleNeuron(d)).toString(16).padStart(2, "0");
      return "#" + c + c + c;
    });

    this.nnOutputTraining.data(this.nn.outputTraining).style("fill", (d) => {
      const c = Math.round(scaleNeuron(d)).toString(16).padStart(2, "0");
      return "#" + c + c + c;
    });

    this.inputEdges
      .data(
        this.nn.firstMatrix.flatMap((row, i) =>
          row.map((weight, j) => ({ i, j, weight }))
        )
      )
      .attr("stroke", (d) => {
        // console.log(d["weight"]);
        const c = Math.round(scaleEdge(d["weight"]))
          .toString(16)
          .padStart(2, "0");
        return "#" + c + c + c;
      });

    this.hiddenEdges
      .data(
        this.nn.secondMatrix.flatMap((row, i) =>
          row.map((weight, j) => ({ i, j, weight }))
        )
      )
      .attr("stroke", (d) => {
        // console.log(d["weight"]);
        const c = Math.round(scaleEdge(d["weight"]))
          .toString(16)
          .padStart(2, "0");
        return "#" + c + c + c;
      });
  }
}

export { NeuralNetworkVisualization };
