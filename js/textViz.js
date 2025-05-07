class TextVisualization {
  constructor(sourceText) {
    document.getElementById("article").innerHTML = sourceText + `<b></b>`; // display text
  }

  dispose() {
    document.getElementById("article").innerHTML = "";
  }

  highlightWords(x, y1, y2) {
    let corpus = document.querySelector("#article").innerHTML;
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

    document.querySelector("#article").innerHTML = tmp[0] + tmp[1];
  }
}
export { TextVisualization };
