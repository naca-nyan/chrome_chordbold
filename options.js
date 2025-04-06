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
      onchange(elem);
    };
  });
}

const options = [
  "chordstyleOption",
  "wordstyleOption",
  "compactOption",
  "compactLineHeight",
  "compactChordMargin",
  "backgroundColor",
  "backgroundColorEnabled",
  "columnCount",
  "replaceMaj",
  "replaceAug",
  "replaceDim",
  "replaceHalfDim",
  "useEmbedPlayer",
];
// Save the options
function saveOptions() {
  const values = {
    chordstyleOption: getRadioValue("chordstyleOption") ?? "normal",
    wordstyleOption: $("wordstyleOption").checked ? "bold" : "normal",
    compactOption: $("compactOption").checked,
    compactLineHeight: $("compactLineHeight").value ?? "16",
    compactChordMargin: $("compactChordMargin").value ?? "6",
    backgroundColorEnabled: $("backgroundColorEnabled").checked,
    backgroundColor: $("backgroundColorPicker").value ?? "#00ff00",
    columnCount: $("columnCount").value,
    replaceMaj: $("replaceMaj").checked,
    replaceAug: $("replaceAug").checked,
    replaceDim: $("replaceDim").checked,
    replaceHalfDim: $("replaceHalfDim").checked,
    useEmbedPlayer: $("useEmbedPlayer").checked,
  };
  chrome.storage.sync.set(values, () => {
    console.log("Option saved.");
  });
}

setRadioBehavior("chordstyleOption", (elem) => {
  const enabled = elem?.checked && elem?.value.startsWith("jazz");
  enableReplaceOptions(enabled);
  saveOptions();
});
$("wordstyleOption").onchange = saveOptions;
$("compactOption").onchange = (e) => {
  enableCompactOptions(e.target.checked);
  saveOptions();
};
$("compactLineHeight").oninput = saveOptions;
$("compactChordMargin").oninput = saveOptions;
$("backgroundColorEnabled").onchange = saveOptions;
$("backgroundColorPicker").onchange = (e) => {
  $("background-color-icon").style.backgroundColor = e.target.value;
  if ($("backgroundColorEnabled").checked) saveOptions();
};
$("columnCount").oninput = (e) => {
  $("columnCountText").innerText = e.target.value;
  saveOptions();
};
$("replaceMaj").onchange = saveOptions;
$("replaceAug").onchange = saveOptions;
$("replaceDim").onchange = saveOptions;
$("replaceHalfDim").onchange = saveOptions;
$("useEmbedPlayer").onchange = saveOptions;

// Load the saved options
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(options, (item) => {
    setRadioValue("chordstyleOption", item.chordstyleOption ?? "bold");
    enableReplaceOptions(item.chordstyleOption.startsWith("jazz"));
    $("wordstyleOption").checked = item.wordstyleOption == "bold";
    $("compactOption").checked = item.compactOption;
    enableCompactOptions(item.compactOption);
    $("compactLineHeight").value = item.compactLineHeight ?? "16";
    $("compactChordMargin").value = item.compactChordMargin ?? "6";
    $("backgroundColorEnabled").checked = item.backgroundColorEnabled;
    const backgroundColor = item.backgroundColor ?? "#00ff00";
    $("backgroundColorPicker").value = backgroundColor;
    $("background-color-icon").style.backgroundColor = backgroundColor;
    $("columnCount").value = item.columnCount ?? "1";
    $("columnCountText").innerText = item.columnCount ?? "1";
    $("replaceMaj").checked = item.replaceMaj ?? true;
    $("replaceAug").checked = item.replaceAug ?? false;
    $("replaceDim").checked = item.replaceDim ?? false;
    $("replaceHalfDim").checked = item.replaceHalfDim ?? false;
    $("useEmbedPlayer").checked = item.useEmbedPlayer ?? true;
  });
});

function enableReplaceOptions(enabled) {
  $("replaceMaj").disabled = !enabled;
  $("replaceAug").disabled = !enabled;
  $("replaceDim").disabled = !enabled;
  $("replaceHalfDim").disabled = !enabled;
}

function enableCompactOptions(enabled) {
  $("compactLineHeight").disabled = !enabled;
  $("compactChordMargin").disabled = !enabled;
}
