// Path pattern:
// Insertion position: Head of all pages
// Type:               JavaScript
// Comment:            Enhanced number list button
(() => {
  const tabSize = 4;

  function checkJsToolBarExist() {
    return window.jsToolBar !== undefined;
  }

  function isUl(text) {
    // Replace `/^\s*[*-]\s/.test(text);` as follow for better performance
    const trimmed = text.trimStart();
    return trimmed.startsWith("* ") || trimmed.startsWith("- ")
      ? trimmed[0]
      : false;
  }

  function isOl(text) {
    // Replace `/^\s*\d+\.\s/.test(text);` as follow for better performance
    const trimmed = text.trimStart();
    const posDot = trimmed.indexOf(". ");
    // Ensure that posDot is not 0 and the substring is a valid number
    if (posDot < 0) return false;
    return Number(trimmed.substring(0, posDot));
  }

  function decorateLines(jsToolBarInstance, fnUl, fnOl, fnDefault) {
    let indexList = [];

    const start = jsToolBarInstance.textarea.selectionStart;
    const end = jsToolBarInstance.textarea.selectionEnd;

    const beforeTextSplitted = jsToolBarInstance.textarea.value
      .substring(0, start)
      .split("\n");
    const selectedText = jsToolBarInstance.textarea.value.substring(start, end);
    const afterTextSplitted = jsToolBarInstance.textarea.value
      .substring(end)
      .split("\n");
    const selectedTextBlock =
      beforeTextSplitted.slice(-1)[0] + selectedText + afterTextSplitted[0];

    const selectedTextBlockReplaced = selectedTextBlock
      .replace(/\r/g, "")
      .split("\n")
      .map((s) => {
        const startSpaceCount = s.length - s.trimStart().length;
        const tabCount = Math.floor(startSpaceCount / tabSize);

        indexList = indexList.slice(0, tabCount + 1);
        if (indexList[tabCount] == undefined) {
          indexList[tabCount] = 0;
        }
        indexList[tabCount]++;
        const index = indexList[tabCount];

        if (isUl(s)) {
          s = fnUl(s, tabCount, index);
        } else if (isOl(s)) {
          s = fnOl(s, tabCount, index);
        } else {
          s = fnDefault(s, tabCount, index);
        }
        return s;
      })
      .join("\n");

    jsToolBarInstance.textarea.value =
      beforeTextSplitted.slice(0, -1).join("\n") +
      (beforeTextSplitted.length > 1 ? "\n" : "") +
      selectedTextBlockReplaced +
      (afterTextSplitted.length > 1 ? "\n" : "") +
      afterTextSplitted.slice(1).join("\n");

    const startNew =
      start +
      selectedTextBlockReplaced.split("\n")[0].length -
      selectedTextBlock.split("\n")[0].length;

    const endNew =
      end + selectedTextBlockReplaced.length - selectedTextBlock.length;

    jsToolBarInstance.textarea.setSelectionRange(startNew, endNew);

    jsToolBarInstance.textarea.focus();
  }

  function decorateUl(e) {
    decorateLines(
      this,
      (s, tabCount) => {
        const tabOffset = e.shiftKey ? -1 : 1;
        if (tabCount < -tabOffset) {
          s = s.replace(/^\s*[*-]\s/, "");
        } else {
          s = s.replace(
            /^\s*/,
            " ".repeat(Math.max(0, tabCount + tabOffset) * tabSize)
          );
        }
        return s;
      },
      (s, tabCount) => {
        return s.replace(/^\s*\d+\.\s/, " ".repeat(tabCount * tabSize) + "* ");
      },
      (s, tabCount) => {
        if (e.shiftKey) return s;
        return s.replace(/^\s*/, " ".repeat(tabCount * tabSize) + "* ");
      }
    );
  }

  function decorateOl(e) {
    decorateLines(
      this,
      (s, tabCount, index) => {
        return s.replace(
          /^\s*[*-]?\s/,
          " ".repeat(tabCount * tabSize) + index + ". "
        );
      },
      (s, tabCount) => {
        const tabOffset = e.shiftKey ? -1 : 1;
        if (tabCount < -tabOffset) {
          s = s.replace(/^\s*[*-]\s/, "");
        } else {
          s = s.replace(
            /^\s*/,
            " ".repeat(Math.max(0, tabCount + tabOffset) * tabSize)
          );
        }
        return s;
      },
      (s, tabCount, index) => {
        if (e.shiftKey) return s;
        return s.replace(/^\s*/, " ".repeat(tabCount * tabSize) + index + ". ");
      }
    );
  }

  function setUpJsToolbar() {
    if (!checkJsToolBarExist()) return false;

    if (jsToolBar.prototype.elements.ul !== undefined) {
      jsToolBar.prototype.elements.ul.fn.wiki = decorateUl;
    }

    if (jsToolBar.prototype.elements.ol !== undefined) {
      jsToolBar.prototype.elements.ol.fn.wiki = decorateOl;
    }

    const jsToolBarDrawOrg = jsToolBar.prototype.draw;
    jsToolBar.prototype.draw = function () {
      const jsToolBarInstance = this;
      jsToolBarDrawOrg.call(jsToolBarInstance);

      jsToolBarInstance.textarea.addEventListener("keydown", (e) => {
        if (e.ctrlKey || e.metaKey) return;
        if (e.key !== "Tab" && e.key !== "Enter") return;
        if ($(".tribute-container").is(":visible")) return;

        const textarea = jsToolBarInstance.textarea;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const beforeText = textarea.value.substring(0, start);
        const beforeTextSplitted = beforeText.split("\n");
        const beforeLastLine = beforeTextSplitted.slice(-1)[0];

        // Shift marker by tab key
        if (e.key === "Tab") {
          if (isUl(beforeLastLine)) {
            e.preventDefault();
            decorateUl.call(jsToolBarInstance, e);
          } else if (isOl(beforeLastLine)) {
            e.preventDefault();
            decorateOl.call(jsToolBarInstance, e);
          }
          return;
        } else if (e.key === "Enter") {
          if (e.shiftKey) return;

          // Add marker when pressed Enter if current line is list item
          let head = null;
          let changed = false;
          const startSpaceCount =
            beforeLastLine.length - beforeLastLine.trimStart().length;
          const ulSign = isUl(beforeLastLine);
          if (ulSign) {
            head = " ".repeat(startSpaceCount) + ulSign + " ";
            changed = head !== beforeLastLine;
          } else {
            const olIndex = isOl(beforeLastLine);
            if (olIndex) {
              head = " ".repeat(startSpaceCount) + (olIndex + 1) + ". ";
              changed =
                " ".repeat(startSpaceCount) + olIndex + ". " !== beforeLastLine;
            }
          }
          
          if (head === null) return;
          if (!changed) {
            textarea.value =
              beforeTextSplitted.slice(0, -1).join("\n") +
              "\n" +
              textarea.value.substring(start);

            var newStart = start - head.length;
            textarea.setSelectionRange(newStart, newStart);
          } else {
            textarea.value =
              textarea.value.substring(0, start) +
              "\n" +
              head +
              textarea.value.substring(start);

            var newStart = start + 1 + head.length;
            textarea.setSelectionRange(newStart, newStart);
          }
          e.preventDefault();
        }
      });
    };

    return true;
  }

  const observer = new MutationObserver(() => {
    // Initialize before loading body
    if (setUpJsToolbar()) {
      observer.disconnect();
    }
  });
  observer.observe(document.documentElement, { childList: true });

  $(() => {
    observer.disconnect();
  });
})();
