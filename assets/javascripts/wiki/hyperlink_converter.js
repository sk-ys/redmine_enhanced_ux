// Path pattern:
// Insertion position: Head of all pages
// Type:               JavaScript
// Comment:            Auto-convert pasted HTML hyperlinks to Markdown/Textile format
(() => {
  function checkJsToolBarExist() {
    return window.jsToolBar !== undefined;
  }

  // Extract title from HTML content
  function extractLinkFromHTML(html) {
    // Try to parse as HTML to extract link and text
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const anchor = doc.querySelector("a");

    if (anchor && anchor.href) {
      const url = anchor.href;
      const text = anchor.textContent.trim() || url;
      return { url, text };
    }

    return null;
  }

  // Convert link to Markdown format
  function toMarkdown(url, text) {
    // Escape Markdown special characters in text: [], \, and `
    // We don't escape () because they can appear in link text without breaking the format
    const escapedText = text
      .replace(/\\/g, "\\\\") // Backslash must be escaped first
      .replace(/\[/g, "\\[")
      .replace(/\]/g, "\\]")
      .replace(/`/g, "\\`");
    return `[${escapedText}](${url})`;
  }

  // Convert link to Textile format
  function toTextile(url, text) {
    // Escape Textile special characters in text
    // In Textile, quotes in link text need to be escaped
    const escapedText = text.replace(/"/g, "&quot;");
    return `"${escapedText}":${url}`;
  }

  function setupPasteHandler() {
    if (!checkJsToolBarExist()) return false;

    const jsToolBarDrawOrg = jsToolBar.prototype.draw;
    jsToolBar.prototype.draw = function () {
      const jsToolBarInstance = this;
      jsToolBarDrawOrg.call(jsToolBarInstance);

      // Determine if using Textile or Markdown
      // Redmine 6+ provides data-text-formatting attribute on body element
      const dataTextFormatting = document.body.getAttribute(
        "data-text-formatting",
      );
      const isTextile = dataTextFormatting
        ? dataTextFormatting === "textile"
        : /^\/help.*\/wiki_syntax_textile/.test(jsToolBarInstance.help_link);

      // Remove any existing paste handler to avoid duplicates
      if (jsToolBarInstance.textarea._hyperlinkPasteHandler) {
        jsToolBarInstance.textarea.removeEventListener(
          "paste",
          jsToolBarInstance.textarea._hyperlinkPasteHandler,
        );
      }

      // Create the paste handler
      const pasteHandler = (e) => {
        // Get clipboard data
        const clipboardData = e.clipboardData || window.clipboardData;
        if (!clipboardData) return;

        // Check if HTML data is available
        const htmlData = clipboardData.getData("text/html");
        if (!htmlData) return;

        // Extract link from HTML
        const linkInfo = extractLinkFromHTML(htmlData);
        if (!linkInfo) return;

        // Prevent default paste behavior
        e.preventDefault();

        // Convert to appropriate format
        const convertedText = isTextile
          ? toTextile(linkInfo.url, linkInfo.text)
          : toMarkdown(linkInfo.url, linkInfo.text);

        // Insert the converted text at cursor position
        const textarea = jsToolBarInstance.textarea;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Insert the text
        textarea.value =
          textarea.value.substring(0, start) +
          convertedText +
          textarea.value.substring(end);

        // Set cursor position after inserted text
        const newPosition = start + convertedText.length;
        textarea.setSelectionRange(newPosition, newPosition);

        // Trigger input event for any listeners
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      };

      // Store reference and add listener
      jsToolBarInstance.textarea._hyperlinkPasteHandler = pasteHandler;
      jsToolBarInstance.textarea.addEventListener("paste", pasteHandler);
    };

    return true;
  }

  const observer = new MutationObserver(() => {
    // Initialize before loading body
    if (setupPasteHandler()) {
      observer.disconnect();
    }
  });
  observer.observe(document.documentElement, { childList: true });

  $(() => {
    observer.disconnect();
  });
})();
