// Path pattern:
// Insertion position: Head of all pages
// Type:               JavaScript
// Comment:            Enhanced list button
(() => {
  const TAB_SIZE = 2;
  const DEFAULT_MARKDOWN_UL_MARKER = "*";
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
    return Math.floor(startSpaceCount / TAB_SIZE);
  }

  const markdownMethods = {
    isUl: (text) => {
      const trimmed = text.trimStart();
      // return trimmed.startsWith("* ") || trimmed.startsWith("- ")
      return /^[*-]\s(?!\[[x\s]\]\s)/.test(trimmed) ? trimmed[0] : false;
    },
    isOl: (text) => {
      const trimmed = text.trimStart();
      const posDot = trimmed.indexOf(". ");
      if (posDot < 0) return false;
      const numStr = trimmed.substring(0, posDot);
      return /^\d+$/.test(numStr) ? Number(numStr) : false;
    },
    isTl: (text) => {
      const trimmed = text.trimStart();
      const start2 = trimmed.slice(0, 2);
      if (start2 !== "* " && start2 !== "- ") return false;
      const trimmed2 = trimmed.substr(2);
      return trimmed2.startsWith("[ ] ")
        ? start2[0] + "0"
        : trimmed2.startsWith("[x] ")
        ? start2[0] + "1"
        : false;
    },
    isList: (text) => {
      return /^\s*[*\-]|\d+\.\s/.test(text);
    },
    extractHeader: (lineStr) => {
      const match = /^\s*(?:[*\-]\s\[[x\s]\]|[*\-]|\d+\.)\s/.exec(lineStr);
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
      } else if (markdownMethods.isTl(lineStr)) {
        lineStr = decorator.fnTl(lineStr, tabCount, index, tabShift);
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
          lineStr = lineStr.replace(/^\s*/, " ".repeat(newTabCount * TAB_SIZE));
        }
        return lineStr;
      },
      fnOl: (lineStr, tabCount) => {
        return lineStr.replace(
          /^\s*\d+\.\s/,
          " ".repeat(tabCount * TAB_SIZE) + DEFAULT_MARKDOWN_UL_MARKER + " "
        );
      },
      fnTl: (lineStr, _) => {
        return lineStr.replace(/^(\s*[*-])\s\[[x\s]\]\s/, "$1 ");
      },
      fnDefault: (
        lineStr,
        tabCount,
        _,
        tabShift,
        sign = DEFAULT_MARKDOWN_UL_MARKER
      ) => {
        if (tabShift < 1) return lineStr;
        return lineStr.replace(
          /^\s*/,
          " ".repeat(tabCount * TAB_SIZE) + sign + " "
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
          " ".repeat(tabCount * TAB_SIZE) + index + ". "
        );
      },
      fnOl: (lineStr, tabCount, index, tabShift) => {
        const newTabCount = Math.max(0, tabCount + tabShift);
        if (tabCount + tabShift < 0) {
          lineStr = markdownMethods.olDecorator.fnClear(lineStr);
        } else {
          lineStr = lineStr.replace(
            /^\s*\d+\.\s/,
            " ".repeat(newTabCount * TAB_SIZE) + index + ". "
          );
        }
        return lineStr;
      },
      fnTl: (lineStr, tabCount, index) => {
        return lineStr.replace(
          /^\s*[*-]\s\[[x\s]\]\s/,
          " ".repeat(tabCount * TAB_SIZE) + index + ". "
        );
      },
      fnDefault: (lineStr, tabCount, index, tabShift) => {
        if (tabShift < 1) return lineStr;
        return lineStr.replace(
          /^\s*/,
          " ".repeat(tabCount * TAB_SIZE) + index + ". "
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
    tlDecorator: {
      fnUl: (lineStr, tabCount) => {
        return lineStr.replace(
          /^\s*([*-])\s/,
          " ".repeat(tabCount * TAB_SIZE) + "$1 [ ] "
        );
      },
      fnOl: (lineStr, tabCount) => {
        return lineStr.replace(
          /^\s*\d+\.\s/,
          " ".repeat(tabCount * TAB_SIZE) + DEFAULT_MARKDOWN_UL_MARKER + " [ ] "
        );
      },
      fnTl: (lineStr, tabCount, _, tabShift) => {
        const newTabCount = Math.max(0, tabCount + tabShift);
        if (tabCount + tabShift < 0) {
          lineStr = markdownMethods.tlDecorator.fnClear(lineStr);
        } else {
          lineStr = lineStr.replace(
            /^\s*([*-]\s\[[x\s]\]\s)/,
            " ".repeat(newTabCount * TAB_SIZE) + "$1"
          );
        }
        return lineStr;
      },
      fnDefault: (
        lineStr,
        tabCount,
        _,
        tabShift,
        sign = DEFAULT_MARKDOWN_UL_MARKER
      ) => {
        if (tabShift < 1) return lineStr;
        return lineStr.replace(
          /^\s*/,
          " ".repeat(tabCount * TAB_SIZE) + sign + " [ ] "
        );
      },
      fnClear: (lineStr) => {
        const trimmed = lineStr.trimStart();
        const beforeSpace = lineStr.substring(
          0,
          lineStr.length - trimmed.length
        );
        return beforeSpace + trimmed.replace(/^[*-]\s\[[x\s]\]\s/, "");
      },
      createEvalStr: (e) => {
        let indexList = [];
        return (lineStr) =>
          markdownMethods.evalStr(
            markdownMethods.tlDecorator,
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

    const firstLine = selectedTextBlock.split("\n")[0];
    const firstLineReplaced = selectedTextBlockReplaced.split("\n")[0];

    const firstLineInfo = getListInfo(firstLine);
    const firstLineHeader = firstLineInfo
      ? methods.extractHeader(firstLine)
      : " ".repeat(firstLine.length - firstLine.trimStart().length);
    const firstLineReplacedInfo = getListInfo(firstLineReplaced);
    const firstLineDelta = firstLineReplaced.length - firstLine.length;
    const textBlockDelta =
      selectedTextBlockReplaced.length - selectedTextBlock.length;

    let startNew =
      startOfLine + firstLineDelta > 0
        ? start + firstLineDelta
        : start - startOfLine;
    let endNew = end;

    if (firstLineInfo && !firstLineReplacedInfo) {
      // Clear
      if (startOfLine <= firstLineInfo.tabCount * TAB_SIZE) {
        startNew = start;
      } else if (startOfLine <= firstLineHeader.length) {
        startNew = start - startOfLine + firstLineInfo.tabCount * TAB_SIZE;
      }
      endNew += textBlockDelta;
    } else if (!firstLineInfo && firstLineReplacedInfo) {
      // Add
      if (startOfLine < firstLineHeader.length) {
        startNew = start;
      } else {
        endNew += textBlockDelta;
      }
    } else if (firstLineInfo && firstLineReplacedInfo) {
      if (firstLineInfo.type !== firstLineReplacedInfo.type) {
        // Change type
        if (startOfLine < firstLineHeader.length) {
          startNew = start;
        } else {
          endNew += textBlockDelta;
        }
      } else {
        // Tab shift
        endNew += textBlockDelta;
      }
    }

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

  function tlDecorator(e) {
    decorateLines(this, methods.tlDecorator.createEvalStr(e));
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

    const tlMarker = methods.isTl(line);
    if (tlMarker !== false) {
      return {
        type: "tl",
        markerOrIndex: tlMarker,
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
        1,
        1,
        listInfo.markerOrIndex
      );
      changed = head !== line;
    } else if (listInfo.type === "ol") {
      head = methods.olDecorator.fnDefault(
        "",
        isTextile ? listInfo.markerOrIndex : listInfo.tabCount,
        isTextile ? 1 : listInfo.markerOrIndex + 1,
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
    } else if (methods === markdownMethods && listInfo.type === "tl") {
      head = methods.tlDecorator.fnDefault(
        "",
        listInfo.tabCount,
        1,
        1,
        listInfo.markerOrIndex[0]
      );
      changed = head !== line;
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
    return [currentLinePrefix, currentLineSuffix];
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
      } else if (methods.isTl(line)) {
        e.preventDefault();
        if (!(e.shiftKey && tabCounts[i] === 0) || maxTabCount === 0) {
          textarea.setSelectionRange(
            startLine + cursorPos,
            startLine + cursorPos + line.length
          );
          tlDecorator.call(jsToolBarInstance, e);
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
    const [currentLinePrefix, currentLineSuffix] = extractCurrentLine(textarea);
    const prefixListInfo = getListInfo(currentLinePrefix);
    if (!prefixListInfo) return;

    const suffixListInfo = getListInfo(currentLineSuffix);
    const { head, changed, offset } = suffixListInfo
      ? {
          head: " ".repeat(prefixListInfo.tabCount * TAB_SIZE),
          changed: true,
          offset: prefixListInfo.tabCount * TAB_SIZE + 1,
        }
      : prepareNewLine(prefixListInfo, currentLinePrefix, isTextile);

    if (head === null) return;

    e.preventDefault();
    insertNewLine(textarea, start, beforeTextSplitted, head, changed, offset);
  }

  function handleSlashKey(e, jsToolBarInstance) {
    e.preventDefault();

    const currentLine = extractCurrentLine(jsToolBarInstance.textarea).join("");
    if (methods.isOl(currentLine)) {
      // ulDecorator.call(jsToolBarInstance, e);
      decorateLines(jsToolBarInstance, methods.olDecorator.fnClear);
    } else {
      olDecorator.call(jsToolBarInstance, e);
    }
  }

  function handlePeriodKey(e, jsToolBarInstance) {
    e.preventDefault();

    const currentLine = extractCurrentLine(jsToolBarInstance.textarea).join("");
    if (methods.isUl(currentLine)) {
      // olDecorator.call(jsToolBarInstance, e);
      decorateLines(jsToolBarInstance, methods.ulDecorator.fnClear);
    } else {
      ulDecorator.call(jsToolBarInstance, e);
    }
  }

  function handleCommaKey(e, jsToolBarInstance) {
    e.preventDefault();

    const currentLine = extractCurrentLine(jsToolBarInstance.textarea).join("");
    if (methods.isTl(currentLine)) {
      decorateLines(jsToolBarInstance, methods.tlDecorator.fnClear);
    } else {
      tlDecorator.call(jsToolBarInstance, e);
    }
  }

  function handleSemicolonKey(e, jsToolBarInstance) {
    const currentLine = extractCurrentLine(jsToolBarInstance.textarea).join("");
    const tlInfo = methods.isTl(currentLine);
    if (tlInfo) {
      e.preventDefault();
      const isChecked = tlInfo.endsWith("1");
      decorateLines(jsToolBarInstance, (lineStr) => {
        return lineStr.replace(/\[[x\s]\]/, isChecked ? "[ ]" : "[x]");
      });
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

    if (jsToolBar.prototype.elements.tl !== undefined) {
      jsToolBar.prototype.elements.tl.fn.wiki = tlDecorator;
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
          case ",":
            // Append task list marker
            if (methods === textileMethods || (!e.ctrlKey && !e.metaKey)) {
              return;
            }
            handleCommaKey(e, jsToolBarInstance);
            break;
          case ";":
            // Toggle task list marker
            if (methods === textileMethods || (!e.ctrlKey && !e.metaKey)) {
              return;
            }
            handleSemicolonKey(e, jsToolBarInstance);
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
