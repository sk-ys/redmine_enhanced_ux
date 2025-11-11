// Path pattern:
// Insertion position: Head of all pages
// Type:               JavaScript
// Comment:            Enhanced list button
(() => {
  const tabSize = 2;
  let methods = null;

  function checkJsToolBarExist() {
    return window.jsToolBar !== undefined;
  }

  // Initialize methods based on whether Textile or Markdown is used
  function initializeMethods(isTextile) {
    methods = isTextile ? textileMethods : markdownMethods;
  }

  function calcTabCount(str) {
    const startSpaceCount = str.length - str.trimStart().length;
    return Math.floor(startSpaceCount / tabSize);
  }

  const markdownMethods = {
    isUl: (text) => {
      const trimmed = text.trimStart();
      return trimmed.startsWith("* ") || trimmed.startsWith("- ")
        ? trimmed[0]
        : false;
    },
    isOl: (text) => {
      const trimmed = text.trimStart();
      const posDot = trimmed.indexOf(". ");
      if (posDot < 0) return false;
      const numStr = trimmed.substring(0, posDot);
      return /^\d+$/.test(numStr) ? Number(numStr) : false;
    },
    isList: (text) => {
      return /^\s*[*\-]|\d+\.\s/.test(text);
    },
    extractHeader: (lineStr) => {
      const match = /^\s*(?:[*\-]|\d+\.)\s/.exec(lineStr);
      if (match) {
        return match[0];
      }
    },
    evalStr: (decorator, lineStr, tabShift, indexList) => {
      const tabCount = calcTabCount(lineStr);

      // Manage list index for ordered lists
      indexList.length = tabCount + 1;
      if (indexList[tabCount] === undefined) {
        indexList[tabCount] = 0;
      }
      indexList[tabCount]++;
      const index = indexList[tabCount];

      if (markdownMethods.isUl(lineStr)) {
        lineStr = decorator.fnUl(lineStr, tabCount, index, tabShift);
      } else if (markdownMethods.isOl(lineStr)) {
        lineStr = decorator.fnOl(lineStr, tabCount, index, tabShift);
      } else {
        lineStr = decorator.fnDefault(lineStr, tabCount, index, tabShift);
      }
      return lineStr;
    },
    ulDecorator: {
      fnUl: (lineStr, tabCount, _, tabShift) => {
        const newTabCount = Math.max(0, tabCount + tabShift);
        if (tabCount + tabShift < 0) {
          lineStr = markdownMethods.ulDecorator.fnClear(lineStr);
        } else {
          lineStr = lineStr.replace(/^\s*/, " ".repeat(newTabCount * tabSize));
        }
        return lineStr;
      },
      fnOl: (lineStr, tabCount) => {
        return lineStr.replace(
          /^\s*\d+\.\s/,
          " ".repeat(tabCount * tabSize) + "* "
        );
      },
      fnDefault: (lineStr, tabCount, _, tabShift, sign = "*") => {
        if (tabShift < 1) return lineStr;
        return lineStr.replace(
          /^\s*/,
          " ".repeat(tabCount * tabSize) + sign + " "
        );
      },
      fnClear: (lineStr) => {
        const trimmed = lineStr.trimStart();
        const beforeSpace = lineStr.substring(
          0,
          lineStr.length - trimmed.length
        );
        return beforeSpace + trimmed.replace(/^[*-]\s/, "");
      },
      createEvalStr: (e) => {
        let indexList = [];
        return (lineStr) =>
          markdownMethods.evalStr(
            markdownMethods.ulDecorator,
            lineStr,
            e.shiftKey ? -1 : 1,
            indexList
          );
      },
    },
    olDecorator: {
      fnUl: (lineStr, tabCount, index) => {
        return lineStr.replace(
          /^\s*[*-]\s/,
          " ".repeat(tabCount * tabSize) + index + ". "
        );
      },
      fnOl: (lineStr, tabCount, index, tabShift) => {
        const newTabCount = Math.max(0, tabCount + tabShift);
        if (tabCount + tabShift < 0) {
          lineStr = markdownMethods.olDecorator.fnClear(lineStr);
        } else {
          lineStr = lineStr.replace(
            /^\s*\d+\.\s/,
            " ".repeat(newTabCount * tabSize) + index + ". "
          );
        }
        return lineStr;
      },
      fnDefault: (lineStr, tabCount, index, tabShift) => {
        if (tabShift < 1) return lineStr;
        return lineStr.replace(
          /^\s*/,
          " ".repeat(tabCount * tabSize) + index + ". "
        );
      },
      fnClear: (lineStr) => {
        const trimmed = lineStr.trimStart();
        const beforeSpace = lineStr.substring(
          0,
          lineStr.length - trimmed.length
        );
        return beforeSpace + trimmed.replace(/^\d+\.\s/, "");
      },
      createEvalStr: (e) => {
        let indexList = [];
        return (lineStr) =>
          markdownMethods.evalStr(
            markdownMethods.olDecorator,
            lineStr,
            e.shiftKey ? -1 : 1,
            indexList
          );
      },
    },
  };

  const textileMethods = {
    isUl: (text) => {
      const res = /^\*+ /.exec(text);
      return res ? res[0].length - 1 : false;
    },
    isOl: (text) => {
      const res = /^\#+ /.exec(text);
      return res ? res[0].length - 1 : false;
    },
    isList: (text) => {
      return /^[\*\#]+\s/.test(text);
    },
    extractHeader: (lineStr) => {
      const match = /^[\*\#]+\s/.exec(lineStr);
      if (match) {
        return match[0];
      }
    },
    evalStr: (decorator, lineStr, tabShift) => {
      const ulIndex = textileMethods.isUl(lineStr);
      if (ulIndex) {
        lineStr = decorator.fnUl(lineStr, ulIndex, tabShift);
      } else {
        const olIndex = textileMethods.isOl(lineStr);
        if (olIndex) {
          lineStr = decorator.fnOl(lineStr, olIndex, tabShift);
        } else {
          lineStr = decorator.fnDefault(lineStr, 1, tabShift);
        }
      }
      return lineStr;
    },
    ulDecorator: {
      fnUl: (lineStr, tabCount, tabShift) => {
        const newTabCount = Math.max(0, tabCount + tabShift);
        if (tabCount + tabShift < 1) {
          lineStr = textileMethods.ulDecorator.fnClear(lineStr);
        } else {
          lineStr = lineStr.replace(/^\*+\s/, "*".repeat(newTabCount) + " ");
        }
        return lineStr;
      },
      fnOl: (lineStr, tabCount) => {
        return lineStr.replace(/^#+\s/, "*".repeat(tabCount) + " ");
      },
      fnDefault: (lineStr, tabCount, tabShift) => {
        if (tabShift < 1) return lineStr;
        return "*".repeat(tabCount) + " " + lineStr;
      },
      fnClear: (lineStr) => {
        return lineStr.replace(/^\*+\s/, "");
      },
      createEvalStr: (e) => {
        return (lineStr) =>
          textileMethods.evalStr(
            textileMethods.ulDecorator,
            lineStr,
            e.shiftKey ? -1 : 1
          );
      },
    },
    olDecorator: {
      fnUl: (lineStr, tabCount) => {
        return lineStr.replace(/^\*+\s/, "#".repeat(tabCount) + " ");
      },
      fnOl: (lineStr, tabCount, tabShift) => {
        const newTabCount = Math.max(0, tabCount + tabShift);
        if (tabCount + tabShift < 1) {
          lineStr = textileMethods.olDecorator.fnClear(lineStr);
        } else {
          lineStr = lineStr.replace(/^#+\s/, "#".repeat(newTabCount) + " ");
        }
        return lineStr;
      },
      fnDefault: (lineStr, tabCount, tabShift) => {
        if (tabShift < 1) return lineStr;
        return "#".repeat(tabCount) + " " + lineStr;
      },
      fnClear: (lineStr) => {
        return lineStr.replace(/^#+\s/, "");
      },
      createEvalStr: (e) => {
        return (lineStr) =>
          textileMethods.evalStr(
            textileMethods.olDecorator,
            lineStr,
            e.shiftKey ? -1 : 1
          );
      },
    },
  };

  function decorateLines(jsToolBarInstance, evalStr) {
    const textarea = jsToolBarInstance.textarea;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const text = textarea.value;
    const beforeTextSplitted = text.substring(0, start).split("\n");
    const selectedText = text.substring(start, end);
    const afterTextSplitted = text.substring(end).split("\n");
    const selectedTextBlock =
      beforeTextSplitted.slice(-1)[0] + selectedText + afterTextSplitted[0];
    const startOfLine = beforeTextSplitted.slice(-1)[0].length;

    const selectedTextBlockReplaced = selectedTextBlock
      .replace(/\r/g, "")
      .split("\n")
      .map(evalStr)
      .join("\n");

    textarea.value =
      beforeTextSplitted.slice(0, -1).join("\n") +
      (beforeTextSplitted.length > 1 ? "\n" : "") +
      selectedTextBlockReplaced +
      (afterTextSplitted.length > 1 ? "\n" : "") +
      afterTextSplitted.slice(1).join("\n");

    const startDelta =
      selectedTextBlockReplaced.split("\n")[0].length -
      selectedTextBlock.split("\n")[0].length;
    const startNew =
      startOfLine + startDelta > 0 ? start + startDelta : start - startOfLine;

    const endNew =
      end + selectedTextBlockReplaced.length - selectedTextBlock.length;

    textarea.setSelectionRange(
      Math.max(0, startNew),
      Math.max(0, startNew, endNew)
    );

    textarea.focus();
  }

  function ulDecorator(e) {
    decorateLines(this, methods.ulDecorator.createEvalStr(e));
  }

  function olDecorator(e) {
    decorateLines(this, methods.olDecorator.createEvalStr(e));

    if (methods === markdownMethods) {
      renumberList(this.textarea);
    }
  }

  function renumberList(textarea) {
    // Backup selection range
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    // For Markdown, renumber the ordered list
    const { listStart, listEnd } = detectSelectedList(textarea);

    // Select the list
    textarea.setSelectionRange(listStart, listEnd);

    // Renumbering
    let indexList = [];
    decorateLines({ textarea }, (lineStr) =>
      markdownMethods.evalStr(
        markdownMethods.olDecorator,
        lineStr,
        0,
        indexList
      )
    );

    // Restore selection range
    textarea.setSelectionRange(selectionStart, selectionEnd);
  }

  function detectSelectedList(textarea) {
    const start = textarea.selectionStart;
    const beforeText = textarea.value.substring(0, start);
    const beforeTextSplitted = beforeText.split("\n");
    const afterText = textarea.value.substring(start);
    const afterTextSplitted = afterText.split("\n");
    const currentLinePrefix = beforeTextSplitted.slice(-1)[0];
    const currentLineSuffix = afterTextSplitted[0];
    const currentLine = currentLinePrefix + currentLineSuffix;

    let listBeforeLength = 0;
    let listAfterLength = 0;
    let listStart = start;
    let listEnd = listStart;

    if (methods.isOl(currentLine)) {
      // Search list item before cursor
      for (let i = beforeTextSplitted.length - 2; i >= 0; i--) {
        const line = beforeTextSplitted[i];
        if (methods.isOl(line)) {
          listBeforeLength += line.length + 1; // +1 for \n
        } else {
          break;
        }
      }
      listStart = listStart - currentLinePrefix.length - listBeforeLength;

      // Search list item after cursor
      for (let i = 1; i < afterTextSplitted.length; i++) {
        const line = afterTextSplitted[i];
        if (methods.isOl(line)) {
          listAfterLength += line.length + 1; // +1 for \n
        } else {
          break;
        }
      }
      listEnd = listEnd + currentLineSuffix.length + listAfterLength;
    }

    return { listStart, listEnd };
  }

  function getListInfo(line) {
    const tabCount = calcTabCount(line);
    const ulMarkerOrIndex = methods.isUl(line);
    if (ulMarkerOrIndex !== false) {
      return {
        type: "ul",
        markerOrIndex: ulMarkerOrIndex,
        tabCount,
      };
    }

    const olIndex = methods.isOl(line);
    if (olIndex !== false) {
      return {
        type: "ol",
        markerOrIndex: olIndex,
        tabCount,
      };
    }

    return null;
  }

  function prepareNewLine(listInfo, line, isTextile) {
    let head = null;
    let changed = false;

    if (listInfo.type === "ul") {
      head = methods.ulDecorator.fnDefault(
        "",
        isTextile ? listInfo.markerOrIndex : listInfo.tabCount,
        null,
        1,
        listInfo.markerOrIndex
      );
      changed = head !== line;
    } else if (listInfo.type === "ol") {
      head = methods.olDecorator.fnDefault(
        "",
        isTextile ? listInfo.markerOrIndex : listInfo.tabCount,
        isTextile ? false : listInfo.markerOrIndex + 1,
        1
      );
      changed =
        (isTextile
          ? head
          : methods.olDecorator.fnDefault(
              "",
              listInfo.tabCount,
              listInfo.markerOrIndex
            )) !== line;
    }

    const offset = changed ? 1 + head.length : -head.length;

    return { head, changed, offset };
  }

  function insertNewLine(
    textarea,
    start,
    beforeTextSplitted,
    head,
    changed,
    offset
  ) {
    if (!changed) {
      // If the line hasn't changed, move cursor to new line without the list
      // marker
      textarea.value =
        beforeTextSplitted.slice(0, -1).join("\n") +
        "\n" +
        textarea.value.substring(start);
    } else {
      // Insert new line with the list marker
      textarea.value =
        textarea.value.substring(0, start) +
        "\n" +
        head +
        textarea.value.substring(start);
    }
    const newStart = start + offset;
    textarea.setSelectionRange(newStart, newStart);
  }

  function extractCurrentLine(textarea) {
    const start = textarea.selectionStart;
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(start);
    const currentLinePrefix = beforeText.split("\n").slice(-1)[0];
    const currentLineSuffix = afterText.split("\n")[0];
    return currentLinePrefix + currentLineSuffix;
  }

  function handleTabKey(e, jsToolBarInstance) {
    const textarea = jsToolBarInstance.textarea;

    // Backup selection range
    const initialSelectionStart = textarea.selectionStart;
    const initialSelectionEnd = textarea.selectionEnd;

    const startLine =
      textarea.value.lastIndexOf("\n", initialSelectionStart - 1) + 1;
    const endLine =
      textarea.value.indexOf("\n", initialSelectionEnd) === -1
        ? textarea.value.length
        : textarea.value.indexOf("\n", initialSelectionEnd);

    const selectedLines = textarea.value
      .substring(startLine, endLine)
      .split("\n");

    const tabCounts = selectedLines.map(calcTabCount);
    const maxTabCount = Math.max(...tabCounts);
    const lineLengths = selectedLines.map((line) => line.length);
    const countShifts = selectedLines.map(() => 0);

    for (let i = selectedLines.length - 1; i >= 0; i--) {
      const line = selectedLines[i];
      const cursorPos =
        lineLengths.slice(0, i).reduce((a, b) => a + b, 0) + (i > 0 ? i : 0);
      let flgDecorated = false;
      if (methods.isUl(line)) {
        e.preventDefault();
        if (!(e.shiftKey && tabCounts[i] === 0) || maxTabCount === 0) {
          textarea.setSelectionRange(
            startLine + cursorPos,
            startLine + cursorPos + line.length
          );
          ulDecorator.call(jsToolBarInstance, e);
          flgDecorated = true;
        }
      } else if (methods.isOl(line)) {
        e.preventDefault();
        if (!(e.shiftKey && tabCounts[i] === 0) || maxTabCount === 0) {
          textarea.setSelectionRange(
            startLine + cursorPos,
            startLine + cursorPos + line.length
          );
          olDecorator.call(jsToolBarInstance, e);
          flgDecorated = true;
        }
      }
      if (flgDecorated) {
        countShifts[i] = e.shiftKey
          ? textarea.selectionEnd - (startLine + cursorPos + line.length)
          : textarea.selectionStart - (startLine + cursorPos);
      }
    }

    // Restore selection range
    textarea.setSelectionRange(
      initialSelectionStart + countShifts[0],
      initialSelectionEnd + countShifts.reduce((a, b) => a + b, 0)
    );
  }

  function handleEnterKey(e, jsToolBarInstance, isTextile) {
    if (e.shiftKey) return;

    const textarea = jsToolBarInstance.textarea;
    const start = textarea.selectionStart;
    const beforeText = textarea.value.substring(0, start);
    const beforeTextSplitted = beforeText.split("\n");
    const currentLinePrefix = beforeTextSplitted.slice(-1)[0];
    const listInfo = getListInfo(currentLinePrefix);
    if (!listInfo) return;

    const { head, changed, offset } = prepareNewLine(
      listInfo,
      currentLinePrefix,
      isTextile
    );

    if (head === null) return;

    e.preventDefault();
    insertNewLine(textarea, start, beforeTextSplitted, head, changed, offset);
  }

  function handleSlashKey(e, jsToolBarInstance) {
    e.preventDefault();

    const currentLine = extractCurrentLine(jsToolBarInstance.textarea);
    if (methods.isOl(currentLine)) {
      // ulDecorator.call(jsToolBarInstance, e);
      decorateLines(jsToolBarInstance, methods.olDecorator.fnClear);
    } else {
      olDecorator.call(jsToolBarInstance, e);
    }
  }

  function handlePeriodKey(e, jsToolBarInstance) {
    e.preventDefault();

    const currentLine = extractCurrentLine(jsToolBarInstance.textarea);
    if (methods.isUl(currentLine)) {
      // olDecorator.call(jsToolBarInstance, e);
      decorateLines(jsToolBarInstance, methods.ulDecorator.fnClear);
    } else {
      ulDecorator.call(jsToolBarInstance, e);
    }
  }

  function handleHomeKey(e, jsToolBarInstance) {
    const textarea = jsToolBarInstance.textarea;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentLinePrefix = textarea.value
      .substring(0, start)
      .split("\n")
      .slice(-1)[0];

    const header = methods.extractHeader(currentLinePrefix);
    if (header !== undefined && currentLinePrefix.length > header.length) {
      e.preventDefault();
      const newStart = start - currentLinePrefix.length + header.length;
      textarea.setSelectionRange(newStart, e.shiftKey ? end : newStart);
    }
  }

  function setUpJsToolbar() {
    if (!checkJsToolBarExist()) return false;

    if (jsToolBar.prototype.elements.ul !== undefined) {
      jsToolBar.prototype.elements.ul.fn.wiki = ulDecorator;
    }

    if (jsToolBar.prototype.elements.ol !== undefined) {
      jsToolBar.prototype.elements.ol.fn.wiki = olDecorator;
    }

    const jsToolBarDrawOrg = jsToolBar.prototype.draw;
    jsToolBar.prototype.draw = function () {
      const jsToolBarInstance = this;
      jsToolBarDrawOrg.call(jsToolBarInstance);

      const isTextile = /^\/help.*\/wiki_syntax_textile/.test(
        jsToolBarInstance.help_link
      );
      if (methods === null) {
        initializeMethods(isTextile);
      }

      jsToolBarInstance.textarea.addEventListener("keydown", (e) => {
        if ($(".tribute-container").is(":visible")) return;

        switch (e.key) {
          case "Tab":
            if (e.ctrlKey || e.metaKey) return;
            handleTabKey(e, jsToolBarInstance);
            break;
          case "Enter":
            if (e.ctrlKey || e.metaKey) return;
            handleEnterKey(e, jsToolBarInstance, isTextile);
            break;
          case "/":
            if (!e.ctrlKey && !e.metaKey) return;
            handleSlashKey(e, jsToolBarInstance);
            break;
          case ".":
            if (!e.ctrlKey && !e.metaKey) return;
            handlePeriodKey(e, jsToolBarInstance);
            break;
          case "Home":
            if (e.ctrlKey || e.metaKey) return;
            handleHomeKey(e, jsToolBarInstance);
            break;
          default:
            break;
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
