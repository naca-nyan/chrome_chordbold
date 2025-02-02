// Save the options
document.getElementById('save').addEventListener('click', function() {
    const chordstyleOption = document.getElementById('chordstyleOption').value;
    const wordstyleOption = document.getElementById('wordstyleOption').value;
    const greenbackOption = document.getElementById('greenbackOption').value;
    const columnCount = document.getElementById('columnCount').value;
    const compactOption = document.getElementById('compactOption').checked;
    chrome.storage.sync.set({chordstyleOption, wordstyleOption, greenbackOption, columnCount, compactOption}, function() {
        console.log('Option saved.');
    });
});

// Load the saved options
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['chordstyleOption', 'wordstyleOption', 'greenbackOption', 'columnCount', 'compactOption'], function(item) {
        document.getElementById('chordstyleOption').value = item.chordstyleOption || 'bold';
        document.getElementById('wordstyleOption').value = item.wordstyleOption || 'normal';
        document.getElementById('greenbackOption').value = item.greenbackOption || 'disable';
        document.getElementById('columnCount').value = item.columnCount || '1';
        document.getElementById('compactOption').checked = item.compactOption || false;
    });
});