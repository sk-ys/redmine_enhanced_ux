// Path pattern:
// Insertion position: Head of all pages
// Type:               JavaScript
// Comment:            Enhanced list button
(() => {
  const tabSize = 4;
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
    evalStr: (decorator, lineStr, shift, indexList) => {
      const tabCount = calcTabCount(lineStr);

      // Manage list index for ordered lists
      indexList.length = tabCount + 1;
      if (indexList[tabCount] === undefined) {
        indexList[tabCount] = 0;
      }
      indexList[tabCount]++;
      const index = indexList[tabCount];

      if (markdownMethods.isUl(lineStr)) {
        lineStr = decorator.fnUl(lineStr, tabCount, index, shift);
      } else if (markdownMethods.isOl(lineStr)) {
        lineStr = decorator.fnOl(lineStr, tabCount, index, shift);
      } else {
        lineStr = decorator.fnDefault(lineStr, tabCount, index, shift);
      }
      return lineStr;
    },
    ulDecorator: {
      fnUl: (lineStr, tabCount, _, shift) => {
        const tabOffset = shift ? -1 : 1;
        const newTabCount = Math.max(0, tabCount + tabOffset);
        if (tabCount + tabOffset < 0) {
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
      fnDefault: (lineStr, tabCount, _, shift, sign = "*") => {
        if (shift) return lineStr;
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
            e.shiftKey,
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
      fnOl: (lineStr, tabCount, _, shift) => {
        const tabOffset = shift ? -1 : 1;
        const newTabCount = Math.max(0, tabCount + tabOffset);
        if (tabCount + tabOffset < 0) {
          lineStr = markdownMethods.olDecorator.fnClear(lineStr);
        } else {
          lineStr = lineStr.replace(/^\s*/, " ".repeat(newTabCount * tabSize));
        }
        return lineStr;
      },
      fnDefault: (lineStr, tabCount, index, shift) => {
        if (shift) return lineStr;
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
            e.shiftKey,
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
    evalStr: (decorator, lineStr, shift) => {
      const ulIndex = textileMethods.isUl(lineStr);
      if (ulIndex) {
        lineStr = decorator.fnUl(lineStr, ulIndex, shift);
      } else {
        const olIndex = textileMethods.isOl(lineStr);
        if (olIndex) {
          lineStr = decorator.fnOl(lineStr, olIndex, shift);
        } else {
          lineStr = decorator.fnDefault(lineStr, 1, shift);
        }
      }
      return lineStr;
    },
    ulDecorator: {
      fnUl: (lineStr, tabCount, shift) => {
        const tabOffset = shift ? -1 : 1;
        const newTabCount = Math.max(0, tabCount + tabOffset);
        if (tabCount + tabOffset < 1) {
          lineStr = textileMethods.ulDecorator.fnClear(lineStr);
        } else {
          lineStr = lineStr.replace(/^\*+\s/, "*".repeat(newTabCount) + " ");
        }
        return lineStr;
      },
      fnOl: (lineStr, tabCount) => {
        return lineStr.replace(/^#+\s/, "*".repeat(tabCount) + " ");
      },
      fnDefault: (lineStr, tabCount, shift) => {
        if (shift) return lineStr;
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
            e.shiftKey
          );
      },
    },
    olDecorator: {
      fnUl: (lineStr, tabCount) => {
        return lineStr.replace(/^\*+\s/, "#".repeat(tabCount) + " ");
      },
      fnOl: (lineStr, tabCount, shift) => {
        const tabOffset = shift ? -1 : 1;
        const newTabCount = Math.max(0, tabCount + tabOffset);
        if (tabCount + tabOffset < 1) {
          lineStr = textileMethods.olDecorator.fnClear(lineStr);
        } else {
          lineStr = lineStr.replace(/^#+\s/, "#".repeat(newTabCount) + " ");
        }
        return lineStr;
      },
      fnDefault: (lineStr, tabCount, shift) => {
        if (shift) return lineStr;
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
            e.shiftKey
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

    const startNew =
      start +
      selectedTextBlockReplaced.split("\n")[0].length -
      selectedTextBlock.split("\n")[0].length;

    const endNew =
      end + selectedTextBlockReplaced.length - selectedTextBlock.length;

    textarea.setSelectionRange(startNew, endNew);

    textarea.focus();
  }

  function ulDecorator(e) {
    decorateLines(this, methods.ulDecorator.createEvalStr(e));
  }

  function olDecorator(e) {
    decorateLines(this, methods.olDecorator.createEvalStr(e));
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
        null,
        listInfo.markerOrIndex
      );
      changed = head !== line;
    } else if (listInfo.type === "ol") {
      head = methods.olDecorator.fnDefault(
        "",
        isTextile ? listInfo.markerOrIndex : listInfo.tabCount,
        isTextile ? false : listInfo.markerOrIndex + 1
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

  function handleTabKey(e, jsToolBarInstance) {
    const textarea = jsToolBarInstance.textarea;
    const start = textarea.selectionStart;
    const beforeText = textarea.value.substring(0, start);
    const beforeLastLine = beforeText.split("\n").slice(-1)[0];

    if (methods.isUl(beforeLastLine)) {
      e.preventDefault();
      ulDecorator.call(jsToolBarInstance, e);
    } else if (methods.isOl(beforeLastLine)) {
      e.preventDefault();
      olDecorator.call(jsToolBarInstance, e);
    }
  }

  function handleEnterKey(e, jsToolBarInstance, isTextile) {
    if (e.shiftKey) return;

    const textarea = jsToolBarInstance.textarea;
    const start = textarea.selectionStart;
    const beforeText = textarea.value.substring(0, start);
    const beforeTextSplitted = beforeText.split("\n");
    const beforeLastLine = beforeTextSplitted.slice(-1)[0];

    const listInfo = getListInfo(beforeLastLine);
    if (!listInfo) return;

    const { head, changed, offset } = prepareNewLine(
      listInfo,
      beforeLastLine,
      isTextile
    );

    if (head === null) return;

    e.preventDefault();
    insertNewLine(textarea, start, beforeTextSplitted, head, changed, offset);
  }

  function handleSlashKey(e, jsToolBarInstance) {
    const textarea = jsToolBarInstance.textarea;
    const start = textarea.selectionStart;
    const beforeText = textarea.value.substring(0, start);
    const beforeLastLine = beforeText.split("\n").slice(-1)[0];

    e.preventDefault();
    if (methods.isOl(beforeLastLine)) {
      // ulDecorator.call(jsToolBarInstance, e);
      decorateLines(jsToolBarInstance, methods.olDecorator.fnClear);
    } else {
      olDecorator.call(jsToolBarInstance, e);
    }
  }

  function handlePeriodKey(e, jsToolBarInstance) {
    const textarea = jsToolBarInstance.textarea;
    const start = textarea.selectionStart;
    const beforeText = textarea.value.substring(0, start);
    const beforeLastLine = beforeText.split("\n").slice(-1)[0];

    e.preventDefault();
    if (methods.isUl(beforeLastLine)) {
      // olDecorator.call(jsToolBarInstance, e);
      decorateLines(jsToolBarInstance, methods.ulDecorator.fnClear);
    } else {
      ulDecorator.call(jsToolBarInstance, e);
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
