import { LangSelector } from "./langSelector";

export default function TextVisualization(sourceText) {
  return (
    <div className="panel panel-primary">
      <div className="panel-heading translate" data-i18n="tdCorpus"></div>
      <div className="panel-body" id="panel-corpus">
        <LangSelector />
        <div id="article"></div>
        <hr />
        <button className="btn btn-primary" id="w2v_training">
          <span className="glyphicon glyphicon-wrench"></span>
          <span className="translate" data-i18n="train"></span>
        </button>
        <button
          className="btn btn-primary translate"
          data-i18n="step"
          id="w2v_step"
        ></button>
        <button
          className="btn btn-primary translate"
          data-i18n="pause"
          id="w2v_pause"
        ></button>
        <button
          className="btn btn-primary translate"
          data-i18n="reset"
          id="w2v_reset"
        ></button>
        <hr />
      </div>
    </div>
  );
}
