export default function VectorVisualization(sourceText) {
  return (
    <div className="panel panel-primary vectorviz-panel">
      <div className="panel-heading translate" data-i18n="VectorSpace"></div>
      <div className="panel-body">
        <div id="positions"></div>
      </div>
    </div>
  );
}
