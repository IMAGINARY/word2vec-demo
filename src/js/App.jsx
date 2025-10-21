import ErrorVisualization from "../components/errorViz";
import NeuralNetworkVisualization from "../components/nnViz";
import TextVisualization from "../components/textViz";
import VectorVisualization from "../components/vectorViz";

export function App() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <TextVisualization />
            <ErrorVisualization />
          </div>

          <div className="col-md-5">
            <VectorVisualization />
          </div>

          <div className="col-md-4">
            <NeuralNetworkVisualization />
          </div>
        </div>
      </div>
    </>
  );
}
