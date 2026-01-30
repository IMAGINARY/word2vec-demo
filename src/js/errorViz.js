import { Chart } from "chart.js";
import i18next from "i18next";

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
            label: "",
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
        legend: {
          display: false,
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
  const epochLabel = i18next.t("epoch");
  const errorLabel = i18next.t("error");
  document.querySelector(
    "#w2v_epoch"
  ).textContent = `${epochLabel}: ${iter} / ${total_iter}, ${errorLabel}: ${errors.toFixed(
    8
  )}`;
};

export { ErrorChart, visualizeError };
