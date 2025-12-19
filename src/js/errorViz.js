import { Chart } from "chart.js";

class ErrorChart {
  constructor() {
    this.chart = null;
    this.initChart();
  }

  initChart() {
    const canvas = document.getElementById("nn_errors");
    if (!canvas) {
      requestAnimationFrame(() => this.initChart());
      return;
    }

    this.chart = new Chart(canvas, {
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
  }

  dispose() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  updateCharts(iter, errors) {
    if (!this.chart) {
      this.initChart();
      if (!this.chart) return;
    }
    this.chart.data.labels.push(iter);
    this.chart.data.datasets.forEach((dataset) => {
      dataset.data.push(errors);
    });
    this.chart.update();
  }
}

const visualizeError = (iter, total_iter, errors) => {
  document.querySelector(
    "#w2v_epoch"
  ).textContent = `epoch: ${iter} / ${total_iter}, error: ${errors}`;
};

export { ErrorChart, visualizeError };
