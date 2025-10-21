export default function NeuralNetworkVisualization(sourceText) {
  return (
    <div className="panel panel-primary">
      <div
        className="panel-heading translate"
        data-i18n="nnVisualization"
      ></div>
      <div id="w2v-vis"></div>
      <div className="panel-footer">
        <div id="w2v_epoch"></div>
      </div>
    </div>
  );
}
