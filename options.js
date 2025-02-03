function getRadioValue(name) {
    for (const e of document.getElementsByName(name)) {
        if (e.checked) return e.value;
    }
    return null;
}
function setRadioValue(name, value) {
    for (const e of document.getElementsByName(name)) {
        if (e.value == value) return e.checked = true;
    }
    return false;
}
// Save the options
function saveOptions() {
    const chordstyleOption = getRadioValue('chordstyleOption') ?? 'bold';
    const wordstyleOption = getRadioValue('wordstyleOption') ?? 'normal';
    const greenbackOption = document.getElementById('greenbackOption').value;
    const columnCount = document.getElementById('columnCount').value;
    const compactOption = document.getElementById('compactOption').checked;
    chrome.storage.sync.set({chordstyleOption, wordstyleOption, greenbackOption, columnCount, compactOption}, function() {
        console.log('Option saved.');
    });
}
document.getElementsByName('chordstyleOption').forEach((e) => e.onchange = saveOptions);
document.getElementsByName('wordstyleOption').forEach((e) => e.onchange = saveOptions);
document.getElementById('greenbackOption').onchange = saveOptions;
document.getElementById('columnCount').onchange = saveOptions;
document.getElementById('compactOption').onchange = saveOptions;

// Load the saved options
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['chordstyleOption', 'wordstyleOption', 'greenbackOption', 'columnCount', 'compactOption'], function(item) {
        setRadioValue('chordstyleOption', item.chordstyleOption || 'bold');
        setRadioValue('wordstyleOption', item.wordstyleOption || 'normal');
        document.getElementById('greenbackOption').value = item.greenbackOption || 'disable';
        document.getElementById('columnCount').value = item.columnCount || '1';
        document.getElementById('compactOption').checked = item.compactOption || false;
    });
});