const styles = {
  "normal": {
    fontSize: "smaller",
    fontWeight: "normal",
    top: "-1.5em",
    lineHeight: "1.5em",
  },
  "bold": {
    fontSize: "smaller",
    fontWeight: "bold",
    top: "-1.5em",
    lineHeight: "1.5em",
  },
  "bold-large": {
    fontSize: "0.95em",
    fontWeight: "bold",
    top: "-1.3em",
    lineHeight: "1.9em",
  },
  "bold-verylarge": {
    fontSize: "1.05em",
    fontWeight: "bold",
    top: "-1.2em",
    lineHeight: "2.1em",
  },
  "jazz": {
    fontSize: "smaller",
    fontWeight: "normal",
    top: "-1.5em",
    lineHeight: "1.5em",
  },
  "jazz-large": {
    fontSize: "0.95em",
    fontWeight: "normal",
    top: "-1.3em",
    lineHeight: "1.9em",
  },
  "jazz-verylarge": {
    fontSize: "1.05em",
    fontWeight: "normal",
    top: "-1.2em",
    lineHeight: "2.1em",
  },
};

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

function applyStyleFromStorage() {
  chrome.storage.sync.get(options, (item) => {
    const chordstyleOption = item.chordstyleOption ?? "bold";
    const wordstyleOption = item.wordstyleOption ?? "normal";
    const compactOption = item.compactOption ?? false;
    const greenbackOption = item.greenbackOption ?? "disable";
    const columnCount = item.columnCount ?? "1";
    const replaceMaj = item.replaceMaj ?? true;
    const replaceAug = item.replaceAug ?? false;
    const replaceDim = item.replaceDim ?? false;
    const replaceHalfDim = item.replaceHalfDim ?? false;

    const style = styles[chordstyleOption];
    const wordFontWeight = {
      normal: "normal",
      bold: "bold",
    }[wordstyleOption];
    const backgroundColor = {
      enable: "#00ff00",
      disable: "#ffffff",
    }[greenbackOption];

    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(`
      span.chord {
        font-size: ${style.fontSize};
        font-weight: ${style.fontWeight};
        top: ${style.top};
      }
      span.word, span.wordtop {
        font-weight: ${wordFontWeight};
      }
      div.main {
        line-height: ${style.lineHeight};
      }
      body {
        background-color: ${backgroundColor};
      }
      div.main div {
        column-count: ${columnCount};
      }`);
    document.adoptedStyleSheets = [styleSheet];

    if (compactOption) {
      // Wrap every `span.chord` and `span.word` pair with `span.chordword`
      document.querySelectorAll(".main .line").forEach((line) => {
        const p = document.createElement("p");
        while (line.children.length > 0) {
          const chord = line.children[0];
          const word = line.children[1];
          if (
            chord.classList.contains("chord") &&
            word &&
            word.classList.contains("word")
          ) {
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

    if (chordstyleOption.startsWith("jazz")) {
      const replaceEntries = [
        replaceAug && [/aug/g, "\uE186"],
        replaceDim && [/dim/g, "\uE187"],
        replaceMaj && [/Maj|maj|M/g, "\uE18A"],
        replaceHalfDim && [/m7-5|m7b5/g, "\uE18F"],
        ["b", "\u266D"],
        ["#", "\u266F"],
        [/(.+)(\(.+?\))/g, "$1<sup>$2</sup>"],
      ].filter((x) => x !== false);
      document.querySelectorAll("span.chord").forEach((chord) => {
        if (!chord.getAttribute("chord")) {
          chord.setAttribute("chord", chord.innerText);
        }
        chord.innerHTML = chord.getAttribute("chord");
        for (const [from, to] of replaceEntries) {
          chord.innerHTML = chord.innerHTML.replaceAll(from, to);
        }
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
      document.querySelectorAll("span.chord").forEach((chord) => {
        if (chord.getAttribute("chord")) {
          chord.innerText = chord.getAttribute("chord");
        }
      });
    }
  });
}

applyStyleFromStorage();
chrome.storage.onChanged.addListener(() => {
  applyStyleFromStorage();
});
