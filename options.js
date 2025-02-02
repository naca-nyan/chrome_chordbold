// Save the options
document.getElementById('save').addEventListener('click', function() {
    const chordstyleOption = document.getElementById('chordstyleOption').value;
    const wordstyleOption = document.getElementById('wordstyleOption').value;
    const greenbackOption = document.getElementById('greenbackOption').value;
    const compactOption = document.getElementById('compactOption').checked;
    chrome.storage.sync.set({chordstyleOption, wordstyleOption, greenbackOption, compactOption}, function() {
        console.log('Option saved.');
    });
});

// Load the saved options
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['chordstyleOption', 'wordstyleOption', 'greenbackOption', 'compactOption'], function(item) {
        document.getElementById('chordstyleOption').value = item.styleOption || 'bold';
        document.getElementById('wordstyleOption').value = item.styleOption || 'normal';
        document.getElementById('greenbackOption').value = item.styleOption || 'disable';
        document.getElementById('compactOption').checked = item.compactOption || false;
    });
});