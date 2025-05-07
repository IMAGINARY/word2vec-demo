const xyz2rtz = (xyz) => ({
  r: Math.sqrt(xyz.x * xyz.x + xyz.y * xyz.y),
  t: Math.atan2(xyz.y, xyz.x),
  z: xyz.z,
});

const rtz2xyz = (rtz) => ({
  x: rtz.r * Math.cos(rtz.t),
  y: rtz.r * Math.sin(rtz.t),
  z: rtz.z,
});

class VectorVisualization {
  constructor(nn) {
    this.nn = nn;

    this.oneHotSize = this.nn.oneHotSize;

    this.trace = {
      x: Array(this.oneHotSize).fill(0.0),
      y: Array(this.oneHotSize).fill(0.0),
      z: Array(this.oneHotSize).fill(0.0),
      text: Array(this.oneHotSize).fill(""),
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

    this.layout = {
      dragmode: true,
      margin: { l: 0, r: 0, b: 0, t: 0 },
      scene: {
        camera: {
          eye: { x: 2, y: 2, z: 2 },
        },
      },
    };

    this.divPos = document.getElementById("positions");

    Plotly.newPlot(this.divPos, [this.trace], this.layout, {
      displayModeBar: false,
    });
  }

  dispose() {
    this.divPos.innerHTML = "";
  }

  runRotation() {
    this.rotate("scene", Math.PI / 1440);
    requestAnimationFrame(() => this.runRotation());
  }

  rotate(id, angle) {
    var eye0 = this.divPos.layout[id].camera.eye;
    var rtz = xyz2rtz(eye0);
    rtz.t += angle;

    var eye1 = rtz2xyz(rtz);
    Plotly.relayout(this.divPos, id + ".camera.eye", eye1);
  }

  redrawPositions(idx, text) {
    this.trace.x[idx] = this.nn.hiddenLayer[0];
    this.trace.y[idx] = this.nn.hiddenLayer[1];
    this.trace.z[idx] = this.nn.hiddenLayer[2];
    this.trace.text[idx] = text;
    Plotly.redraw("positions");
  }
}

export { VectorVisualization };
