export default function ErrorVisualization(sourceText) {
  return (
    <div className="panel panel-primary errorviz-panel">
      <div className="panel-heading translate" data-i18n="ErrorOverEpoch"></div>
      <div className="panel-body">
        <canvas id="nn_errors"></canvas>
      </div>
      <div className="panel-footer">
        <div id="w2v_epoch"></div>
      </div>
    </div>
  );
}
