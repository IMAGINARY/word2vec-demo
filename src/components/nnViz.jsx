export default function NeuralNetworkVisualization(sourceText) {
  return (
    <div className="panel panel-primary nnviz-panel">
      <div
        className="panel-heading translate"
        data-i18n="nnVisualization"
      ></div>
      <div id="w2v-vis"></div>
    </div>
  );
}
