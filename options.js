function $(id) {
  return document.getElementById(id);
}
function getRadioValue(name) {
  for (const e of document.getElementsByName(name)) {
    if (e.checked) return e.value;
  }
  return null;
}
function setRadioValue(name, value) {
  for (const e of document.getElementsByName(name)) {
    e.checked = e.value == value;
  }
  return false;
}
function setRadioBehavior(name, onchange) {
  const elems = document.getElementsByName(name);
  elems.forEach((elem) => {
    elem.onchange = () => {
      for (const other of elems) {
        if (elem != other) other.checked = false;
      }
      onchange();
    };
  });
}

const options = [
  "chordstyleOption",
  "wordstyleOption",
  "compactOption",
  "greenbackOption",
  "columnCount",
  "replaceMaj",
  "replaceAug",
  "replaceDim",
  "replaceHalfDim",
];
// Save the options
function saveOptions() {
  const values = {
    chordstyleOption: getRadioValue("chordstyleOption") ?? "normal",
    wordstyleOption: $("wordstyleOption").checked ? "bold" : "normal",
    compactOption: $("compactOption").checked,
    greenbackOption: $("greenbackOption").checked ? "enable" : "disable",
    columnCount: $("columnCount").value,
    replaceMaj: $("replaceMaj").checked,
    replaceAug: $("replaceAug").checked,
    replaceDim: $("replaceDim").checked,
    replaceHalfDim: $("replaceHalfDim").checked,
  };
  chrome.storage.sync.set(values, () => {
    console.log("Option saved.");
  });
}

setRadioBehavior("chordstyleOption", saveOptions);
$("wordstyleOption").onchange = saveOptions;
$("compactOption").onchange = saveOptions;
$("greenbackOption").onchange = saveOptions;
$("columnCount").oninput = (e) => {
  $("columnCountText").innerText = e.target.value;
  saveOptions();
};
$("replaceMaj").onchange = saveOptions;
$("replaceAug").onchange = saveOptions;
$("replaceDim").onchange = saveOptions;
$("replaceHalfDim").onchange = saveOptions;

// Load the saved options
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(options, (item) => {
    setRadioValue("chordstyleOption", item.chordstyleOption || "bold");
    $("wordstyleOption").checked = item.wordstyleOption == "bold";
    $("compactOption").checked = item.compactOption;
    $("greenbackOption").checked = item.greenbackOption == "enable";
    $("columnCount").value = item.columnCount || "1";
    $("columnCountText").innerText = item.columnCount || "1";
    $("replaceMaj").checked = item.replaceMaj || true;
    $("replaceAug").checked = item.replaceAug || false;
    $("replaceDim").checked = item.replaceDim || false;
    $("replaceHalfDim").checked = item.replaceHalfDim || false;
  });
});
