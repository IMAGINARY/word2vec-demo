class TextVisualization {
  constructor(sourceText) {
    this.sourceText = sourceText;
    this.article = null;
    this.init();
  }

  init() {
    const article = document.getElementById("article");
    if (!article) {
      requestAnimationFrame(() => this.init()); // wait for React to mount
      return;
    }

    this.article = article;
    this.article.innerHTML = this.sourceText + `<b></b>`; // display text
  }

  dispose() {
    if (this.article) {
      this.article.innerHTML = "";
      this.article = null;
    }
  }

  highlightWords(x, y1, y2) {
    if (!this.article) {
      this.init();
      if (!this.article) return;
    }

    let corpus = this.article.innerHTML;
    let tmp = corpus.split("<b>");

    tmp[0] = tmp[0].replace(/<[^>]*>?/gm, "");
    tmp[1] = tmp[1].replace(/<[^>]*>?/gm, "");

    if (y1 == "") {
      tmp[0] = tmp[0].replace(`${x} ${y2}`, `<b>${x} ${y2}</b>`);
    } else if (y2 == "") {
      tmp[1] = tmp[1].replace(`${y1} ${x}`, `<b>${y1} ${x}</b>`);
    } else {
      tmp[1] = tmp[1].replace(`${y1} ${x} ${y2}`, `<b>${y1} ${x} ${y2}</b>`);
    }

    this.article.innerHTML = tmp[0] + tmp[1];
  }
}
export { TextVisualization };
