function applyStyleFromStorage() {
  chrome.storage.sync.get(['chordstyleOption', 'wordstyleOption', 'greenbackOption', 'columnCount', 'compactOption'], function(item) {
    const chordstyleOption = item.chordstyleOption || 'bold';
    const wordstyleOption = item.wordstyleOption || 'normal';
    const greenbackOption = item.greenbackOption || 'disable';
    const columnCount = item.columnCount || '1';
    const compactOption = item.compactOption || false;
    let chordfontSize, chordfontWeight, chordtop, lineHeight;
    let wordfontWeight;
    let background;
    let enableJazzFont = false;

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
        case 'jazz':
            enableJazzFont = true;
            chordfontSize = 'smaller';
            chordfontWeight = 'normal';
            chordtop = '-1.5em';
            lineHeight = '1.5em';
            break;
        case 'jazz-large':
            enableJazzFont = true;
            chordfontSize = '0.95em';
            chordfontWeight = 'normal';
            chordtop = '-1.3em';
            lineHeight = '1.9em';
            break;
        case 'jazz-verylarge':
            enableJazzFont = true;
            chordfontSize = '1.05em';
            chordfontWeight = 'normal';
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

    document.querySelectorAll('span.wordtop').forEach(function(word) {
        word.style.fontWeight = wordfontWeight;
    });

    document.querySelectorAll('div.main').forEach(function(div) {
        div.style.lineHeight = lineHeight;
    });

    document.body.style.backgroundColor = background;

    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(`div.main div { column-count: ${columnCount}; }`);
    document.adoptedStyleSheets = [styleSheet];

    if (compactOption) {
      // Wrap every `span.chord` and `span.word` pair with `span.chordword`
      document.querySelectorAll(".main .line").forEach(function(line) {
        const p = document.createElement("p");
        while (line.children.length > 0) {
          const chord = line.children[0];
          const word = line.children[1];
          if (chord.classList.contains("chord") &&
              word && word.classList.contains("word")) {
            const span = document.createElement("span");
            span.classList = "chordword";
            span.appendChild(chord);
            span.appendChild(word);
            p.appendChild(span);
          } else {
            p.appendChild(chord);
          }
        }
        line.innerHTML = p.innerHTML;
      });
      const styleSheet = new CSSStyleSheet();
      styleSheet.replaceSync(`
        div.main span.chordword {
          display: inline-flex;
          flex-direction: column;
        }
        div.main span.chord, div.main span.word, div.main span.wordtop {
          position: static;
          line-height: 1em;
        }
        div.main span.wordtop {
          vertical-align: bottom;
        }
        div.main span.chord {
          margin-right: 6px;
        }
        div.main span.word {
          white-space: pre;
        }
        div.main p.line {
          margin-block: 0 .3em;
        }
      `);
      document.adoptedStyleSheets.push(styleSheet);
    }

    if (enableJazzFont) {
      document.querySelectorAll('span.chord').forEach(function(chord) {
        if (!chord.getAttribute("chord")) chord.setAttribute("chord", chord.innerText);
        chord.innerText = chord.getAttribute("chord")
          .replaceAll("b", "\u266D")
          .replaceAll("#", "\u266F")
          .replaceAll(/Maj|maj|M/g, "\uE18A");
      });
      const styleSheet = new CSSStyleSheet();
      styleSheet.replaceSync(`
        @font-face {
          font-family: "MuseJazz Text";
          size-adjust: 110%;
          src: local("MuseJazz Text"), url(https://cdn.jsdelivr.net/npm/@vexflow-fonts/musejazztext@1.0.1/musejazztext.woff2) format("woff2");
        }
        div.main span.chord {
          font-family: "MuseJazz Text";
        }
      `);
      document.adoptedStyleSheets.push(styleSheet);
    } else {
      document.querySelectorAll('span.chord').forEach(function(chord) {
        if (chord.getAttribute("chord")) chord.innerText = chord.getAttribute("chord");
      });
    }
  });
}

applyStyleFromStorage();
chrome.storage.onChanged.addListener(function() {
  applyStyleFromStorage();
});