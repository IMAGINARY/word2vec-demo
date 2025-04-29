function highlightWords(x, y1, y2) {
  let corpus = $("#article").html();
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

  $("#article").html(tmp[0] + tmp[1]);
}

export { highlightWords };
