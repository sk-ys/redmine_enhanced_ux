// Path pattern:
// Insertion position: Head of all pages
// Type:               HTML
// Comment:            Insert attachment tag
$(function () {
  if (typeof jsToolBar === "undefined") return;
  if (typeof addInlineAttachmentMarkup === "undefined") return;

  // Replace the original addInlineAttachmentMarkup
  const addInlineAttachmentMarkupOrg = addInlineAttachmentMarkup;

  addInlineAttachmentMarkup = function (file) {
    const textarea = handleFileDropEvent.target;

    const beforeText = textarea.value;
    addInlineAttachmentMarkupOrg(file);
    const afterText = textarea.value;
    if (beforeText !== afterText) return;

    if (textarea.nodeName !== "TEXTAREA") return;

    addAttachmentTag(file, textarea);
  };

  function addAttachmentTag(file, textarea) {
    let prefix = "";
    let suffix = "";
    let filename = file.name;
    const end = textarea.selectionEnd;
    if (end === undefined) return; // Abort if no text is selected.
    if (end > 0 && textarea.value.substr(end - 1, 1).match(/\S/)) {
      prefix = " " + prefix;
    }
    if (textarea.value.substr(end, 1).match(/\S/)) {
      suffix = " ";
    } else {
      suffix = textarea.value.length == end ? "\n" : "";
    }

    if (filename !== encodeURIComponent(filename)) {
      filename = '"' + filename + '"';
    }

    const text = prefix + "attachment:" + filename + suffix;
    textarea.value =
      textarea.value.substring(0, end) +
      text +
      textarea.value.substring(end + 1);
  }
});
