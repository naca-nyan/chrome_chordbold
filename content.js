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

function applyStyleFromStorage() {
  chrome.storage.sync.get(options, (item) => {
    const chordstyleOption = item.chordstyleOption ?? "bold";
    const wordstyleOption = item.wordstyleOption ?? "normal";
    const compactOption = item.compactOption ?? false;
    const compactLineHeight = item.compactLineHeight ?? "16";
    const compactChordMargin = item.compactChordMargin ?? "6";
    const backgroundColor = item.backgroundColorEnabled
      ? item.backgroundColor ?? "#00ff00"
      : "#ffffff";
    const columnCount = item.columnCount ?? "1";
    const replaceMaj = item.replaceMaj ?? true;
    const replaceAug = item.replaceAug ?? false;
    const replaceDim = item.replaceDim ?? false;
    const replaceHalfDim = item.replaceHalfDim ?? false;
    const useEmbedPlayer = item.useEmbedPlayer ?? true;

    const style = styles[chordstyleOption];
    const wordFontWeight = {
      normal: "normal",
      bold: "bold",
    }[wordstyleOption];

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
      span.chord, span.word, span.wordtop {
        white-space: pre;
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
          line-height: ${compactLineHeight}px;
        }
        div.main span.wordtop {
          vertical-align: bottom;
        }
        div.main span.chord {
          margin-right: ${compactChordMargin}px;
        }
        div.main p, div.main br {
          margin-block: 0 .3em;
          line-height: ${compactLineHeight}px;
        }
      `);
      document.adoptedStyleSheets.push(styleSheet);
    }

    if (chordstyleOption.startsWith("jazz")) {
      const replaceEntries = [
        ["（", "("],
        ["）", ")"],
        replaceAug && [/aug/g, "\uE186"],
        replaceDim && [/dim/g, "\uE187"],
        replaceMaj && [/Maj|maj|M/g, "\uE18A"],
        replaceHalfDim && [/m7[-b]5|m7\([-b]5\)/g, "\uE18F"],
        ["&nbsp;", " "],
        ["b", "\u266D"],
        ["#", "\u266F"],
        [/([^/\s]+?)(\([^/]+?\))/g, "$1<sup>$2</sup>"],
        [/^([^\(]+)([-+][59]|omit[35])/g, "$1<sup>$2</sup>"],
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

    if (useEmbedPlayer) enableEmbedPlayer();
  });
}

applyStyleFromStorage();
chrome.storage.onChanged.addListener(() => {
  applyStyleFromStorage();
});

const fullscreenBtn = {
  button: document.createElement("button"),
  img: document.createElement("img"),
  iconOpen:
    `https://material-icons.github.io/material-icons/svg/open_in_full/baseline.svg`,
  iconClose:
    `https://material-icons.github.io/material-icons/svg/close_fullscreen/baseline.svg`,
  init() {
    this.button.style.zIndex = 0;
    this.button.style.border = "none";
    this.button.style.padding = "0";
    this.button.style.width = "33px";
    this.button.style.height = "33px";
    this.button.style.borderRadius = "50%";
    this.button.style.cursor = "pointer";
    this.setClose(false);
    this.button.appendChild(this.img);
    document.querySelector("div.main")?.prepend(this.button);
  },
  setClose(value) {
    if (value) {
      this.img.src = this.iconClose;
      this.button.style.position = "fixed";
      this.button.style.top = "30px";
      this.button.style.right = "30px";
    } else {
      this.img.src = this.iconOpen;
      this.button.style.position = "absolute";
      this.button.style.top = null;
      this.button.style.right = "230px";
    }
  },
};
fullscreenBtn.init();

let fullscreen = false;
function setFullscreen(value = true) {
  fullscreen = value;
  const main = document.querySelector("div.main");
  const mainDiv = document.querySelector("div.main div");
  if (value) {
    const color = window.getComputedStyle(document.body).backgroundColor;
    main.style.display = "flex";
    main.style.flexDirection = "column";
    main.style.justifyContent = "safe center";
    main.style.backgroundColor = color;
    main.style.paddingBottom = "20px";
    main.style.overflow = "auto";
    mainDiv.style.margin = "0 auto";
    mainDiv.style.maxWidth = "97vw";
    main.requestFullscreen();
    fullscreenBtn.setClose(true);
  } else {
    main.style = null;
    mainDiv.style = null;
    if (document.fullscreenElement) document.exitFullscreen();
    fullscreenBtn.setClose(false);
  }
}
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) setFullscreen(false);
});
fullscreenBtn.button.onclick = () => setFullscreen(!fullscreen);

function enableEmbedPlayer() {
  const videoPlayer = {
    container: document.createElement("div"),
    player: document.createElement("div"),
    button: document.createElement("button"),
    active: false,
    init() {
      this.container.style.position = "fixed";
      this.container.style.zIndex = 2147483647;
      this.container.style.bottom = "0";
      this.container.style.right = "0";
      this.container.style.textAlign = "right";
      this.button.onclick = () => this.setActive(false);
      this.button.innerHTML =
        `<img src="https://material-icons.github.io/material-icons/svg/close/baseline.svg" alt="close" />`;
      this.player.style.width = "640px";
      this.player.style.height = "360px";
      this.container.append(this.button, this.player);
    },
    setVideo(type, videoId) {
      switch (type) {
        case "youtube":
          this.player.innerHTML =
            `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1"
              width="640" height="360" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>`;
          return;
        case "niconico":
          this.player.innerHTML =
            `<iframe src="https://embed.nicovideo.jp/watch/${videoId}"
              width="640" height="360" frameborder="0" 
              scrolling="no"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
              allowfullscreen
            ></iframe>`;
          return;
      }
    },
    setActive(value = true) {
      this.active = value;
      if (value) {
        document.body.append(this.container);
      } else {
        this.container.remove();
      }
    },
  };
  videoPlayer.init();
  document.querySelectorAll(".movie a").forEach((movie) => {
    if (movie.href.startsWith("https://www.youtube.com")) {
      const videoId = movie.href.split("?v=").pop();
      if (videoId) {
        movie.onclick = (e) => {
          e.preventDefault();
          videoPlayer.setVideo("youtube", videoId);
          if (!videoPlayer.active) videoPlayer.setActive(true);
        };
      }
    }
    if (movie.href.startsWith("https://www.nicovideo.jp")) {
      const videoId = movie.href.split("/").pop();
      if (videoId) {
        movie.onclick = (e) => {
          e.preventDefault();
          videoPlayer.setVideo("niconico", videoId);
          if (!videoPlayer.active) videoPlayer.setActive(true);
        };
      }
    }
  });
}
