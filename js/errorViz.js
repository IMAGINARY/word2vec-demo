$("#nn_errors").width = $("#article").width();
$("#nn_errors").height = $("#article").width();

class ErrorChart {
  constructor() {
    this.chart = new Chart($("#nn_errors"), {
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
    // document.querySelector("#nn_errors>canvas").remove();
  }

  updateCharts(iter, errors) {
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
