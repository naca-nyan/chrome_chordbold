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
    elems.forEach(elem => {
        elem.onchange = () => {
            for (const other of elems) {
                if (elem != other) other.checked = false;
            }
            onchange();
        }
    })
}

// Save the options
function saveOptions() {
    const chordstyleOption = getRadioValue('chordstyleOption') ?? 'normal';
    const wordstyleOption = document.getElementById('wordstyleOption').checked ? 'bold' : 'normal';
    const compactOption = document.getElementById('compactOption').checked;
    const greenbackOption = document.getElementById('greenbackOption').checked ? 'enable' : 'disable';
    const columnCount = document.getElementById('columnCount').value;
    chrome.storage.sync.set({chordstyleOption, wordstyleOption, greenbackOption, columnCount, compactOption}, function() {
        console.log('Option saved.');
    });
}

setRadioBehavior('chordstyleOption', saveOptions);
document.getElementById('wordstyleOption').onchange = saveOptions;
document.getElementById('compactOption').onchange = saveOptions;
document.getElementById('greenbackOption').onchange = saveOptions;
document.getElementById('columnCount').oninput = (e) => {
    document.getElementById('columnCountText').innerText = e.target.value;
    saveOptions();
}

// Load the saved options
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['chordstyleOption', 'wordstyleOption', 'greenbackOption', 'columnCount', 'compactOption'], function(item) {
        setRadioValue('chordstyleOption', item.chordstyleOption || 'bold');
        document.getElementById('wordstyleOption').checked = item.wordstyleOption == 'bold';
        document.getElementById('compactOption').checked = item.compactOption;
        document.getElementById('greenbackOption').checked = item.greenbackOption == 'enable';
        document.getElementById('columnCount').value = item.columnCount || '1';
        document.getElementById('columnCountText').innerText = item.columnCount || '1';
    });
});
