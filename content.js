chrome.storage.sync.get(['chordstyleOption', 'wordstyleOption', 'greenbackOption'], function(item) {
  const chordstyleOption = item.chordstyleOption || 'bold';
  const wordstyleOption = item.wordstyleOption || 'normal';
  const greenbackOption = item.greenbackOption || 'disable';
  let chordfontSize, chordfontWeight, chordtop, lineHeight;
  let wordfontWeight;
  let background;

  switch(chordstyleOption) {
      case 'normal':
          chordfontSize = 'smaller';
          chordfontWeight = 'normal';
          chordtop = '-1.5em';
          lineHeight = '1.5em';
          break;
      case 'bold':
          chordfontSize = 'smaller';
          chordfontWeight = 'bold';
          chordtop = '-1.5em';
          lineHeight = '1.5em';
          break;
      case 'bold-large':
          chordfontSize = '0.95em';
          chordfontWeight = 'bold';
          chordtop = '-1.3em';
          lineHeight = '1.9em';
          break;
      case 'bold-verylarge':
          chordfontSize = '1.05em';
          chordfontWeight = 'bold';
          chordtop = '-1.2em';
          lineHeight = '2.1em';
          break;
      default:
          chordfontSize = 'smaller';
          chordfontWeight = 'bold';
          chordtop = '-1.5em';
          lineHeight = '1.5em';
  }

  switch(wordstyleOption) {
      case 'normal':
          wordfontWeight = 'normal';
          break;
      case 'bold':
          wordfontWeight = 'bold';
          break;
      default:
          wordfontWeight = 'normal';
  }

  switch(wordstyleOption) {
    case 'normal':
        wordfontWeight = 'normal';
        break;
    case 'bold':
        wordfontWeight = 'bold';
        break;
    default:
        wordfontWeight = 'normal';
  }

  switch(greenbackOption) {
    case 'disable':
        background = '#FFFFFF';
        break;
    case 'enable':
        background = '#00902A';
        break;
    default:
        background = '#FFFFFF';
  }

  document.querySelectorAll('span.chord').forEach(function(chord) {
      chord.style.fontSize = chordfontSize;
      chord.style.fontWeight = chordfontWeight;
      chord.style.top = chordtop;
  });

  document.querySelectorAll('span.word').forEach(function(word) {
      word.style.fontWeight = wordfontWeight;
  });

  document.querySelectorAll('div.main').forEach(function(div) {
      div.style.lineHeight = lineHeight;
  });

  document.body.style.backgroundColor = background;
});