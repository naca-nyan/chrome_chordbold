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
    const compactOption = getRadioValue('compactOption') == 'compact';
    const greenbackOption = getRadioValue('greenbackOption') == 'green' ? 'enable' : 'disable';
    const columnCount = document.getElementById('columnCount').value;
    chrome.storage.sync.set({chordstyleOption, wordstyleOption, greenbackOption, columnCount, compactOption}, function() {
        console.log('Option saved.');
    });
}
document.getElementsByName('chordstyleOption').forEach((e) => e.onchange = saveOptions);
document.getElementsByName('wordstyleOption').forEach((e) => e.onchange = saveOptions);
document.getElementsByName('compactOption').forEach((e) => e.onchange = saveOptions);
document.getElementsByName('greenbackOption').forEach((e) => e.onchange = saveOptions);
document.getElementById('columnCount').oninput = saveOptions;

// Load the saved options
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['chordstyleOption', 'wordstyleOption', 'greenbackOption', 'columnCount', 'compactOption'], function(item) {
        setRadioValue('chordstyleOption', item.chordstyleOption || 'bold');
        setRadioValue('wordstyleOption', item.wordstyleOption || 'normal');
        setRadioValue('compactOption', item.compactOption ? 'compact' : 'normal');
        setRadioValue('greenbackOption', item.greenbackOption == 'enabled' ? 'green' : 'white');
        document.getElementById('columnCount').value = item.columnCount || '1';
    });
});
