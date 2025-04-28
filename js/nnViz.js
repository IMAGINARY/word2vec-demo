// import * as d3 from "./d3.min.js";
// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// import * as d3 from "./d3.v7.min.js";

const scaleNeuron = d3.scaleLinear().domain([0.0, 1.0]).range([0, 255]);
const scaleEdge = d3.scaleLinear().domain([-5.5, 5.5]).range([0, 255]);
const r = 10;

class NeuralNetworkVisualization {
  constructor(nn) {
    this.nn = nn;

    this.oneHotSize = this.nn.oneHotSize;

    this.width = $("#w2v-vis").parent().width();
    this.height = 976;

    d3.select("div#w2v-vis > *").remove();

    this.nnSvg = d3
      .select("div#w2v-vis")
      .append("div")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("style", "background-color: #ADD7F6;");

    this.textInput = this.nnSvg
      .append("g")
      .classed("input-text", true)
      .append("text");

    this.textOutput1 = this.nnSvg
      .append("g")
      .classed("input-text", true)
      .append("text");

    this.textOutput2 = this.nnSvg
      .append("g")
      .classed("input-text", true)
      .append("text");

    this.nnInput = this.nnSvg
      .selectAll("g.input-neuron")
      .data(this.nn.inputLayer)
      .enter()
      .append("g")
      .classed("input-neuron", true)
      .append("circle");

    this.nnHidden = this.nnSvg
      .selectAll("g.hidden1-neuron")
      .data(this.nn.hiddenLayer)
      .enter()
      .append("g")
      .classed("hidden1-neuron", true)
      .append("circle");

    this.nnOutput = this.nnSvg
      .selectAll("g.hidden2-neuron")
      .data(this.nn.outputLayer)
      .enter()
      .append("g")
      .classed("hidden2-neuron", true)
      .append("circle");

    this.inputEdges = this.nnSvg
      .selectAll("g.input-edge")
      .data(this.nn.firstEdges)
      .enter()
      .append("g")
      .classed("input-edge", true)
      .append("line");

    this.hiddenEdges = this.nnSvg
      .selectAll("g.hidden-edge")
      .data(this.nn.secondEdges)
      .enter()
      .append("g")
      .classed("hidden-edge", true)
      .append("line");

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
  }

  getPosY(i, len) {
    const mid = this.height / 2;
    const step = 15;
    const halfStep = step / 2;
    const numberOfNeuron = len / 2;
    const startPos =
      mid - ((numberOfNeuron + numberOfNeuron) * step + halfStep);
    return startPos + i * 2 * step;
  }

  update(x, y1, y2) {
    const sizeOfText = 24;

    this.textInput
      .text(x)
      .attr("x", 0)
      .attr("y", this.getPosY(0, 1) + sizeOfText / 2)
      .style("font-size", sizeOfText.toString() + "px")
      .style("color", "black");

    this.textOutput1
      .text(y1)
      .attr("x", 350)
      .attr(
        "y",
        this.getPosY(this.oneHotSize / 2, this.oneHotSize * 2) + sizeOfText / 2
      )
      .style("font-size", sizeOfText.toString() + "px")
      .style("color", "black");

    this.textOutput2
      .text(y2)
      .attr("x", 350)
      .attr(
        "y",
        this.getPosY(
          this.oneHotSize + this.oneHotSize / 2,
          this.oneHotSize * 2
        ) +
          sizeOfText / 2
      )
      .style("font-size", sizeOfText.toString() + "px")
      .style("color", "black");

    this.nnInput
      .data(this.nn.inputLayer)
      .attr("cx", 125)
      .attr("cy", (d, i) => this.getPosY(i, this.nn.inputLayer.length))
      .attr("r", r)
      .style("fill", (d) => {
        const c = Math.round(scaleNeuron(d)).toString(16).padStart(2, "0");
        console.log(c);

        return "#" + c + c + c;
      })
      .on("mouseover", (d) => {
        tooltip.style("visibility", "visible");
      })
      .on("mousemove", (d) => {
        tooltip
          .text(d)
          .style("top", d3.event.pageY - 10 + "px")
          .style("left", d3.event.pageX + 10 + "px");
      })
      .on("mouseout", (d) => {
        tooltip.style("visibility", "hidden");
      });

    this.nnHidden
      .data(this.nn.hiddenLayer)
      .attr("cx", 225)
      .attr("cy", (d, i) => this.getPosY(i, this.nn.hiddenLayer.length))
      .attr("r", r)
      .style("fill", (d) => {
        const c = Math.round(scaleNeuron(d)).toString(16).padStart(2, "0");
        return "#" + c + c + c;
      })
      .on("mouseover", (d) => tooltip.style("visibility", "visible"))
      .on("mousemove", (d) => {
        return tooltip
          .text(d)
          .style("top", d3.event.pageY - 10 + "px")
          .style("left", d3.event.pageX + 10 + "px");
      })
      .on("mouseout", (d) => tooltip.style("visibility", "hidden"));

    this.nnOutput
      .data(this.nn.outputLayer)
      .attr("cx", 325)
      .attr("cy", (d, i) => this.getPosY(i, this.nn.outputLayer.length))
      .attr("r", r)
      .style("fill", (d) => {
        const c = Math.round(scaleNeuron(d)).toString(16).padStart(2, "0");
        return "#" + c + c + c;
      })
      .on("mouseover", (d) => tooltip.style("visibility", "visible"))
      .on("mousemove", (d) => {
        return tooltip
          .text(d)
          .style("top", d3.event.pageY - 10 + "px")
          .style("left", d3.event.pageX + 10 + "px");
      })
      .on("mouseout", (d) => tooltip.style("visibility", "hidden"));

    this.inputEdges
      .data(this.nn.firstEdges)
      .attr("x1", 125 + r)
      .attr("y1", (d) => this.getPosY(d["i"], this.nn.inputLayer.length))
      .attr("x2", 225 - r)
      .attr("y2", (d) => this.getPosY(d["j"], this.nn.hiddenLayer.length))
      .attr("stroke", (d) => {
        // console.log(d["weight"]);
        const c = Math.round(scaleEdge(d["weight"]))
          .toString(16)
          .padStart(2, "0");
        return "#" + c + c + c;
      })
      .attr("stroke-width", 3)
      .on("mouseover", (d) => tooltip.style("visibility", "visible"))
      .on("mousemove", (d) => {
        return tooltip
          .text(d["weight"])
          .style("top", d3.event.pageY - 10 + "px")
          .style("left", d3.event.pageX + 10 + "px");
      })
      .on("mouseout", (d) => tooltip.style("visibility", "hidden"));

    this.hiddenEdges
      .data(this.nn.secondEdges)
      .attr("x1", 225 + r)
      .attr("y1", (d) => this.getPosY(d["i"], this.nn.hiddenLayer.length))
      .attr("x2", 325 - r)
      .attr("y2", (d) => this.getPosY(d["j"], this.nn.outputLayer.length))
      .attr("stroke", (d) => {
        // console.log(d["weight"]);
        const c = Math.round(scaleEdge(d["weight"]))
          .toString(16)
          .padStart(2, "0");
        return "#" + c + c + c;
      })
      .attr("stroke-width", 3)
      .on("mouseover", (d) => tooltip.style("visibility", "visible"))
      .on("mousemove", (d) => {
        return tooltip
          .text(d["weight"])
          .style("top", d3.event.pageY - 10 + "px")
          .style("left", d3.event.pageX + 10 + "px");
      })
      .on("mouseout", (d) => tooltip.style("visibility", "hidden"));
  }
}

export { NeuralNetworkVisualization };
