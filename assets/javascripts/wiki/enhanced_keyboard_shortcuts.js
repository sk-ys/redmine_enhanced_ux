// Path pattern:
// Insertion position: Head of all pages
// Type:               JavaScript
// Comment:            Enhanced keyboard shortcuts
window.addEventListener("DOMContentLoaded", () => {
  $("#main").on("keydown", "textarea", (e) => {
    const textarea = e.target;
    const isMac = /Mac/.test(navigator.platform);
    const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
    
    // Get current line information
    function getCurrentLineInfo() {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      
      // Find the start and end of the current line
      const lineStart = text.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = text.indexOf('\n', end);
      const actualLineEnd = lineEnd === -1 ? text.length : lineEnd;
      
      return {
        lineStart,
        lineEnd: actualLineEnd,
        lineText: text.substring(lineStart, actualLineEnd),
        start,
        end,
        text
      };
    }
    
    // Get all selected lines
    function getSelectedLines() {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      
      const lineStart = text.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = text.indexOf('\n', end - 1);
      const actualLineEnd = lineEnd === -1 ? text.length : text.indexOf('\n', end);
      const finalLineEnd = actualLineEnd === -1 ? text.length : actualLineEnd;
      
      return {
        lineStart,
        lineEnd: finalLineEnd,
        linesText: text.substring(lineStart, finalLineEnd),
        start,
        end,
        text
      };
    }
    
    // Update textarea value and selection
    function updateTextarea(newValue, newStart, newEnd) {
      textarea.value = newValue;
      textarea.setSelectionRange(newStart, newEnd);
      // Trigger input event for compatibility
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Cut line (empty selection) - Ctrl+X / ⌘X
    if (ctrlOrCmd && e.key === 'x' && !e.shiftKey && !e.altKey) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start === end) {
        e.preventDefault();
        const info = getCurrentLineInfo();
        
        // Copy line to clipboard
        const lineToCopy = info.lineText + '\n';
        navigator.clipboard.writeText(lineToCopy).catch(() => {
          // Silently fail if clipboard access is denied
          // The line will still be cut as a fallback behavior
        });
        
        // Remove the line
        const newValue = info.text.substring(0, info.lineStart) + 
                        info.text.substring(info.lineEnd + (info.lineEnd < info.text.length ? 1 : 0));
        const newStart = Math.min(info.lineStart, newValue.length);
        updateTextarea(newValue, newStart, newStart);
      }
    }
    
    // Copy line (empty selection) - Ctrl+C / ⌘C
    if (ctrlOrCmd && e.key === 'c' && !e.shiftKey && !e.altKey) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start === end) {
        e.preventDefault();
        const info = getCurrentLineInfo();
        
        // Copy line to clipboard
        const lineToCopy = info.lineText + '\n';
        navigator.clipboard.writeText(lineToCopy).catch(() => {
          // Silently fail if clipboard access is denied
        });
      }
    }
    
    // Move line up - Alt+↑ / ⌥↑
    if (e.altKey && e.key === 'ArrowUp' && !ctrlOrCmd && !e.shiftKey) {
      e.preventDefault();
      const info = getSelectedLines();
      
      // Can't move if already at the top
      if (info.lineStart === 0) return;
      
      // Find the previous line
      const prevLineEnd = info.lineStart - 1;
      const prevLineStart = info.text.lastIndexOf('\n', prevLineEnd - 1) + 1;
      const prevLineText = info.text.substring(prevLineStart, prevLineEnd);
      
      // Swap the lines
      const newValue = info.text.substring(0, prevLineStart) +
                      info.linesText + '\n' +
                      prevLineText + 
                      (info.lineEnd < info.text.length ? info.text.substring(info.lineEnd) : '');
      
      const offset = prevLineText.length + 1;
      const newStart = info.start - offset;
      const newEnd = info.end - offset;
      updateTextarea(newValue, newStart, newEnd);
    }
    
    // Move line down - Alt+↓ / ⌥↓
    if (e.altKey && e.key === 'ArrowDown' && !ctrlOrCmd && !e.shiftKey) {
      e.preventDefault();
      const info = getSelectedLines();
      
      // Can't move if already at the bottom
      if (info.lineEnd >= info.text.length) return;
      
      // Find the next line
      const nextLineStart = info.lineEnd + 1;
      const nextLineEnd = info.text.indexOf('\n', nextLineStart);
      const actualNextLineEnd = nextLineEnd === -1 ? info.text.length : nextLineEnd;
      const nextLineText = info.text.substring(nextLineStart, actualNextLineEnd);
      
      // Swap the lines
      const beforeLines = info.text.substring(0, info.lineStart);
      const afterLines = actualNextLineEnd < info.text.length ? info.text.substring(actualNextLineEnd) : '';
      
      const newValue = beforeLines +
                      nextLineText + '\n' +
                      info.linesText +
                      afterLines;
      
      const offset = nextLineText.length + 1;
      const newStart = info.start + offset;
      const newEnd = info.end + offset;
      updateTextarea(newValue, newStart, newEnd);
    }
    
    // Copy line up - Shift+Alt+↑ / ⇧⌥↑
    if (e.shiftKey && e.altKey && e.key === 'ArrowUp' && !ctrlOrCmd) {
      e.preventDefault();
      const info = getSelectedLines();
      
      // Insert a copy of the selected lines above
      const newValue = info.text.substring(0, info.lineStart) +
                      info.linesText + '\n' +
                      info.text.substring(info.lineStart);
      
      updateTextarea(newValue, info.start, info.end);
    }
    
    // Copy line down - Shift+Alt+↓ / ⇧⌥↓
    if (e.shiftKey && e.altKey && e.key === 'ArrowDown' && !ctrlOrCmd) {
      e.preventDefault();
      const info = getSelectedLines();
      
      // Insert a copy of the selected lines below
      const newValue = info.text.substring(0, info.lineEnd) +
                      '\n' +
                      info.linesText +
                      info.text.substring(info.lineEnd);
      
      const offset = info.linesText.length + 1;
      const newStart = info.start + offset;
      const newEnd = info.end + offset;
      updateTextarea(newValue, newStart, newEnd);
    }
    
    // Delete line - Ctrl+Shift+K / ⌘⇧K
    if (ctrlOrCmd && e.shiftKey && e.key === 'K') {
      e.preventDefault();
      const info = getSelectedLines();
      
      // Remove the selected lines
      const newValue = info.text.substring(0, info.lineStart) +
                      info.text.substring(info.lineEnd + (info.lineEnd < info.text.length ? 1 : 0));
      const newStart = Math.min(info.lineStart, newValue.length);
      updateTextarea(newValue, newStart, newStart);
    }
  });
});
