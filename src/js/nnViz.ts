import * as d3 from "d3";
import i18next from "i18next";
import type { NeuralNetwork } from "./NeuralNetwork";

const scaleNeuron = d3
  .scaleLinear<string>()
  .domain([0.0, 1.0])
  .range(["black", "white"]);

const scaleEdge = d3
  .scaleLinear<string>()
  .domain([-5.5, 5.5])
  .range(["black", "white"]);

const r = 10; // radius of neuron circle
const step = 30; // vertical distance between neurons

/** Calculate Y position of item i of a total of nItems items,
 * so that the items are centered in a container of
 * height "height", starting from position "offset"
 */
const getPosY = (i: number, nItems: number, height: number, offset: number) => {
  const mid = offset + height / 2;
  const startPos = mid - (nItems * step) / 2 + step / 2;
  return startPos + i * step;
};

interface NeuralNetworkVisualization {
  nn: NeuralNetwork;
  oneHotSize: number;
  labels: string[];
  width: number;
  height: number;
  nnHeight: number;
  captionHeight: number;
  nnMargin: number;
  status: string;
  nnSvg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> | undefined;
  textInput: d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
  textHidden: d3.Selection<SVGTextElement, any, any, any>;
  textPrediction: d3.Selection<SVGTextElement, any, any, any>;
  textOutput1: d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
  textOutput2: d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
  inputEdges: d3.Selection<SVGLineElement, any, any, any>;
  nnInputLabels: d3.Selection<SVGTextElement, any, any, any>;
  hiddenEdges: d3.Selection<SVGLineElement, any, any, any>;
  nnInput: d3.Selection<SVGCircleElement, any, any, any>;
  nnHidden: d3.Selection<SVGCircleElement, any, any, any>;
  nnOutput: d3.Selection<SVGCircleElement, any, any, any>;
  nnOutputPercentages: d3.Selection<SVGRectElement, any, any, any>;
  nnOutputTraining: d3.Selection<SVGCircleElement, any, any, any>;
  nnOutputLabels: d3.Selection<SVGTextElement, any, any, any>;
  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  captionInput: d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
  captionHiddenLine1: d3.Selection<SVGTSpanElement, unknown, HTMLElement, any>;
  captionHiddenLine2: d3.Selection<SVGTSpanElement, unknown, HTMLElement, any>;
  captionOutputLine1: d3.Selection<SVGTSpanElement, unknown, HTMLElement, any>;
  captionOutputLine2: d3.Selection<SVGTSpanElement, unknown, HTMLElement, any>;
  captionGoalLine1: d3.Selection<SVGTSpanElement, unknown, HTMLElement, any>;
  captionGoalLine2: d3.Selection<SVGTSpanElement, unknown, HTMLElement, any>;
  handleLanguageChange: ((lang: string) => void) | undefined;
  dispose(): void;
  update(x: string, y1: string, y2: string): void;
}

class NeuralNetworkVisualization {
  constructor(nn: NeuralNetwork, tokenLabels: string[]) {
    this.labels = tokenLabels.concat(["[NULL]"]); // for padding token
    this.nn = nn;
    this.oneHotSize = this.nn.oneHotSize;
    this.width = 800;
    this.nnHeight = 2 * this.oneHotSize * step;
    this.captionHeight = 100;
    this.nnMargin = 20;
    this.height = this.nnHeight + this.captionHeight + 2 * this.nnMargin + 100;

    this.status = "paused"; // training, prediction, paused
    this.buildVisualization();
  }

  private buildVisualization() {
    if (this.nnSvg) return; // already built

    const host = d3.select("div#w2v-vis");
    if (host.empty()) {
      requestAnimationFrame(() => this.buildVisualization()); // wait for React to mount host
      return;
    }

    const bottomLineY =
      this.captionHeight + this.nnHeight + 2 * this.nnMargin + 20;

    this.nnSvg = host
      .append("svg")
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .classed("nnviz-svg", true);

    this.nnSvg
      .append("line")
      .attr("x1", (1 / 5) * this.width - 50)
      .attr("y1", bottomLineY - 30)
      .attr("x2", (4 / 5) * this.width + 50)
      .attr("y2", bottomLineY - 30)
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    this.captionInput = this.nnSvg
      .append("g")
      .attr("transform", `translate(${(1 / 5) * this.width}, ${bottomLineY})`)
      .append("text")
      .classed("nnVizCaption", true);

    const hiddenText = this.nnSvg
      .append("g")
      .attr("transform", `translate(${(2 / 5) * this.width}, ${bottomLineY})`)
      .append("text")
      .classed("nnVizCaption", true);
    this.captionHiddenLine1 = hiddenText
      .append("tspan")
      .attr("x", 0)
      .attr("text-anchor", "middle");
    this.captionHiddenLine2 = hiddenText
      .append("tspan")
      .attr("x", 0)
      .attr("dy", "1.2em")
      .attr("text-anchor", "middle");

    const outputText = this.nnSvg
      .append("g")
      .attr("transform", `translate(${(3 / 5) * this.width}, ${bottomLineY})`)
      .append("text")
      .classed("nnVizCaption", true);
    this.captionOutputLine1 = outputText
      .append("tspan")
      .attr("x", 0)
      .attr("text-anchor", "middle");
    this.captionOutputLine2 = outputText
      .append("tspan")
      .attr("x", 0)
      .attr("dy", "1.2em")
      .attr("text-anchor", "middle");

    const goalText = this.nnSvg
      .append("g")
      .attr("transform", `translate(${(4 / 5) * this.width}, ${bottomLineY})`)
      .append("text")
      .classed("nnVizCaption", true);
    this.captionGoalLine1 = goalText
      .append("tspan")
      .attr("x", 0)
      .attr("text-anchor", "middle");
    this.captionGoalLine2 = goalText
      .append("tspan")
      .attr("x", 0)
      .attr("dy", "1.2em")
      .attr("text-anchor", "middle");

    this.updateCaptions();
    this.handleLanguageChange = () => this.updateCaptions();
    i18next.on("languageChanged", this.handleLanguageChange);

    this.textInput = this.nnSvg
      .append("g")
      .classed("input-text", true)
      .append("text")
      .attr("x", (1 / 5) * this.width)
      .attr(
        "y",
        getPosY(0, 1, this.captionHeight, this.nnHeight + 2 * this.nnMargin)
      );

    this.textPrediction = this.nnSvg
      .selectAll("g.prediction-text")
      .data([0, 0]) //dummy data for two output predictions
      .enter()
      .append("g")
      .classed("prediction-text", true)
      .append("text")
      .attr("x", (3 / 5) * this.width)
      .attr("y", (d, i) =>
        getPosY(i, 2, this.captionHeight, this.nnHeight + 2 * this.nnMargin)
      );

    this.textOutput1 = this.nnSvg
      .append("g")
      .classed("output-text", true)
      .append("text")
      .attr("x", (4 / 5) * this.width)
      .attr(
        "y",
        getPosY(0, 2, this.captionHeight, this.nnHeight + 2 * this.nnMargin)
      );

    this.textOutput2 = this.nnSvg
      .append("g")
      .classed("input-text", true)
      .append("text")
      .attr("x", (4 / 5) * this.width)
      .attr(
        "y",
        getPosY(1, 2, this.captionHeight, this.nnHeight + 2 * this.nnMargin)
      );

    this.textHidden = this.nnSvg
      .selectAll("g.hidden-text")
      .data(this.nn.hiddenLayer)
      .enter()
      .append("g")
      .classed("hidden-text", true)
      .append("text")
      .attr("x", (2 / 5) * this.width)
      .attr("y", (d, i) =>
        getPosY(i, 3, this.captionHeight, this.nnHeight + 2 * this.nnMargin)
      );

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
      .attr("y1", (d) =>
        getPosY(d["i"], this.nn.inputLayer.length, this.nnHeight, this.nnMargin)
      )
      .attr("x2", (2 / 5) * this.width)
      .attr("y2", (d) =>
        getPosY(
          d["j"],
          this.nn.hiddenLayer.length,
          this.nnHeight,
          this.nnMargin
        )
      );

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
      .attr("y1", (d) =>
        getPosY(
          d["i"],
          this.nn.hiddenLayer.length,
          this.nnHeight,
          this.nnMargin
        )
      )
      .attr("x2", (3 / 5) * this.width)
      .attr("y2", (d) =>
        getPosY(
          d["j"],
          this.nn.outputLayer.length,
          this.nnHeight,
          this.nnMargin
        )
      );

    this.nnInput = this.nnSvg
      .selectAll("g.input-neuron")
      .data(this.nn.inputLayer)
      .enter()
      .append("g")
      .classed("input-neuron", true)
      .classed("neuron", true)
      .append("circle")
      .attr("cx", (1 / 5) * this.width)
      .attr("cy", (d, i) =>
        getPosY(i, this.nn.inputLayer.length, this.nnHeight, this.nnMargin)
      )
      .attr("r", r);

    this.nnInputLabels = this.nnSvg
      .selectAll("g.input-neuron-label")
      .data(this.labels)
      .enter()
      .append("g")
      .classed("input-neuron-label", true)
      .append("text")
      .text((d) => d)
      .attr("x", (1 / 5) * this.width - r - 5)
      .attr("y", (d, i) =>
        getPosY(i, this.nn.inputLayer.length, this.nnHeight, this.nnMargin)
      );

    this.nnHidden = this.nnSvg
      .selectAll("g.hidden1-neuron")
      .data(this.nn.hiddenLayer)
      .enter()
      .append("g")
      .classed("hidden1-neuron", true)
      .classed("neuron", true)
      .append("circle")
      .attr("cx", (2 / 5) * this.width)
      .attr("cy", (d, i) =>
        getPosY(i, this.nn.hiddenLayer.length, this.nnHeight, this.nnMargin)
      )
      .attr("r", r);

    this.nnOutput = this.nnSvg
      .selectAll("g.hidden2-neuron")
      .data(this.nn.outputLayer)
      .enter()
      .append("g")
      .classed("hidden2-neuron", true)
      .classed("neuron", true)
      .append("circle")
      .attr("cx", (3 / 5) * this.width)
      .attr("cy", (d, i) =>
        getPosY(i, this.nn.outputLayer.length, this.nnHeight, this.nnMargin)
      )
      .attr("r", r);

    this.nnOutputPercentages = this.nnSvg
      .selectAll("g.hidden2-neuron-percentage")
      .data(this.nn.outputLayer)
      .enter()
      .append("g")
      .classed("hidden2-neuron-percentage", true)
      .append("rect")
      .attr("x", (3 / 5) * this.width + r + 20)
      .attr(
        "y",
        (d, i) =>
          getPosY(i, this.nn.outputLayer.length, this.nnHeight, this.nnMargin) -
          r
      )
      .attr("width", (d) => d * 100)
      .attr("height", r * 2);

    this.nnOutputTraining = this.nnSvg
      .selectAll("g.hidden2-neuron-training")
      .data(this.nn.outputTraining)
      .enter()
      .append("g")
      .classed("hidden2-neuron-training", true)
      .classed("neuron", true)
      .append("circle")
      .attr("cx", (4 / 5) * this.width)
      .attr("cy", (d, i) =>
        getPosY(i, this.nn.outputLayer.length, this.nnHeight, this.nnMargin)
      )
      .attr("r", r);

    this.nnOutputLabels = this.nnSvg
      .selectAll("g.output-neuron-label")
      .data(this.labels.concat(this.labels))
      .enter()
      .append("g")
      .classed("output-neuron-label", true)
      .append("text")
      .text((d, i) => d)
      .attr("x", (4 / 5) * this.width + r + 5)
      .attr("y", (d, i) =>
        getPosY(i, this.nn.outputLayer.length, this.nnHeight, this.nnMargin)
      );

    this.tooltip = d3
      .select("body")
      .append("div")
      .classed("nnviz-tooltip", true)
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
    if (this.nnSvg) {
      this.nnSvg.remove();
      this.nnSvg = undefined;
    }

    if (this.handleLanguageChange) {
      i18next.off("languageChanged", this.handleLanguageChange);
      this.handleLanguageChange = undefined;
    }
  }

  private updateCaptions() {
    this.captionInput.text(i18next.t("nnVizInput"));
    this.captionHiddenLine1.text(i18next.t("nnVizHiddenLayer"));
    this.captionHiddenLine2.text(i18next.t("nnVizHiddenVector"));
    this.captionOutputLine1.text(i18next.t("nnVizOutput"));
    this.captionOutputLine2.text(i18next.t("nnVizOutputPrediction"));
    this.captionGoalLine1.text(i18next.t("nnVizGoal"));
    this.captionGoalLine2.text(i18next.t("nnVizGoalTraining"));
  }

  /* Get the top prediction from each output section */
  predictions = (outputs: number[]) => {
    const sections = [
      outputs.slice(0, this.oneHotSize),
      outputs.slice(this.oneHotSize),
    ];

    const maxProb = sections.map(
      (section) =>
        section
          .map((d, i) => ({ index: i, value: d }))
          .reduce((max, curr) => (curr.value > max.value ? curr : max), {
            index: -1,
            value: -Infinity,
          }) // index of max value in each section;
    );

    const predictedText = maxProb.map(
      (d) => `${this.labels[d.index]} (${(d.value * 100).toFixed(1)}%)`
    );

    return predictedText;
  };

  update(x: string, y1: string, y2: string) {
    if (!this.nnSvg) {
      this.buildVisualization();
      if (!this.nnSvg) return;
    }

    this.predictions(this.nn.outputLayer);

    this.textInput.text(x);
    this.textHidden.data(this.nn.hiddenLayer).text((d) => d.toFixed(3));
    this.textPrediction
      .data(this.predictions(this.nn.outputLayer))
      .text((d) => d);
    this.textOutput1.text(y1);
    this.textOutput2.text(y2);

    this.nnInput.data(this.nn.inputLayer).style("fill", (d) => scaleNeuron(d));

    this.nnHidden
      .data(this.nn.hiddenLayer)
      .style("fill", (d) => scaleNeuron(d));

    this.nnOutput
      .data(this.nn.outputLayer)
      .style("fill", (d) => scaleNeuron(d));

    this.nnOutputPercentages
      .data(this.nn.outputLayer)
      .attr("width", (d) => d * 100);

    this.nnOutputTraining
      .data(this.nn.outputTraining)
      .style("fill", (d) => scaleNeuron(d));

    this.inputEdges
      .data(
        this.nn.firstMatrix.flatMap((row, i) =>
          row.map((weight, j) => ({ i, j, weight }))
        )
      )
      .style("stroke", (d) => scaleEdge(d["weight"]));

    this.hiddenEdges
      .data(
        this.nn.secondMatrix.flatMap((row, i) =>
          row.map((weight, j) => ({ i, j, weight }))
        )
      )
      .style("stroke", (d) => scaleEdge(d["weight"]));
  }
}

export { NeuralNetworkVisualization };
