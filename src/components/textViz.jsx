import { useState } from "react";
import { LangSelector, localizeKey } from "./langSelector";

export default function TextVisualization(sourceText) {
  const [status, setStatus] = useState("stopped"); // "stopped", "training", "paused"

  return (
    <div className="panel panel-primary textviz-panel">
      <div className="panel-heading translate" data-i18n="tdCorpus"></div>
      <div className="panel-body" id="panel-corpus">
        <div id="article"></div>
        <div className="button-group">
          <hr />
          <button //  Train / Pause button
            id="w2v_training"
            className="btn btn-primary"
            onClick={() => {
              console.log(`Current status: ${status}`);
              switch (status) {
                case "stopped":
                case "paused":
                  setStatus("training");
                  window.w2v.train();
                  console.log("Training started");
                  break;
                case "training":
                  setStatus("paused");
                  window.w2v.pause();
                  console.log("Training paused");
                  break;
              }
            }}
          >
            {status === "training" ? (
              <>
                <span className="glyphicon glyphicon-pause"></span>
                <span className="translate" data-i18n="pause">
                  {localizeKey("pause")}
                </span>
              </>
            ) : (
              <>
                <span className="glyphicon glyphicon-play"></span>
                <span className="translate" data-i18n="train">
                  {localizeKey("train")}
                </span>
              </>
            )}
          </button>

          <button
            className="btn btn-primary translate"
            data-i18n="step"
            id="w2v_step"
            onClick={() => {
              setStatus("paused");
              window.w2v.pause();
              window.w2v.trainDataPoint();
            }}
          ></button>

          <button
            className="btn btn-primary translate"
            data-i18n="reset"
            id="w2v_reset"
            onClick={() => {
              setStatus("stopped");
              window.w2v.reset();
            }}
          ></button>

          <hr />
        </div>
      </div>
    </div>
  );
}
