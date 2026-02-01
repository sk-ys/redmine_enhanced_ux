// Path pattern:
// Insertion position: Head of all pages
// Type:               JavaScript
// Comment:            Enhanced keyboard shortcuts
window.addEventListener("DOMContentLoaded", () => {
  // Helper functions for line operations
  const LineHelpers = {
    // Get current line information
    getCurrentLineInfo(textarea) {
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
    },
    
    // Get all selected lines
    getSelectedLines(textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      
      // Find the start of the line containing the selection start
      const lineStart = text.lastIndexOf('\n', start - 1) + 1;
      
      // Find the end of the line containing the selection end
      // Special case: if cursor is at the very beginning of a line (right after a newline),
      // we exclude that line from the selection to match editor behavior
      let lineEnd;
      if (end === 0 || (end > 0 && text[end - 1] === '\n')) {
        // Cursor is at line start, use the position before the newline
        lineEnd = end > 0 ? end - 1 : 0;
      } else {
        // Find the newline at or after the end position
        lineEnd = text.indexOf('\n', end);
        if (lineEnd === -1) {
          lineEnd = text.length;
        }
      }
      
      return {
        lineStart,
        lineEnd,
        linesText: text.substring(lineStart, lineEnd),
        start,
        end,
        text
      };
    },
    
    // Update textarea value and selection
    updateTextarea(textarea, newValue, newStart, newEnd) {
      textarea.value = newValue;
      textarea.setSelectionRange(newStart, newEnd);
      // Trigger input event for compatibility
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  $("#main").on("keydown", "textarea", (e) => {
    const textarea = e.target;
    // Detect Mac using userAgent instead of deprecated navigator.platform
    const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent);
    const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
    
    // Cut line (empty selection) - Ctrl+X / ⌘X
    if (ctrlOrCmd && e.key === 'x' && !e.shiftKey && !e.altKey) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start === end) {
        e.preventDefault();
        const info = LineHelpers.getCurrentLineInfo(textarea);
        
        // Copy line to clipboard
        const lineToCopy = info.lineText + '\n';
        navigator.clipboard.writeText(lineToCopy).catch(() => {
          // Silently fail if clipboard access is denied
          // The cut operation proceeds regardless of clipboard status
        });
        
        // Remove the line
        const newValue = info.text.substring(0, info.lineStart) + 
                        info.text.substring(info.lineEnd + (info.lineEnd < info.text.length ? 1 : 0));
        const newStart = Math.min(info.lineStart, newValue.length);
        LineHelpers.updateTextarea(textarea, newValue, newStart, newStart);
      }
    }
    
    // Copy line (empty selection) - Ctrl+C / ⌘C
    if (ctrlOrCmd && e.key === 'c' && !e.shiftKey && !e.altKey) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start === end) {
        e.preventDefault();
        const info = LineHelpers.getCurrentLineInfo(textarea);
        
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
      const info = LineHelpers.getSelectedLines(textarea);
      
      // Can't move if already at the top
      if (info.lineStart === 0) return;
      
      // Find the previous line
      const prevLineEnd = info.lineStart - 1;
      const prevLineStart = info.text.lastIndexOf('\n', prevLineEnd - 1) + 1;
      const prevLineText = info.text.substring(prevLineStart, prevLineEnd);
      
      // Determine if we need to preserve the trailing newline
      const hasTrailingNewline = info.lineEnd < info.text.length;
      
      // Swap the lines
      const newValue = info.text.substring(0, prevLineStart) +
                      info.linesText + 
                      (hasTrailingNewline ? '\n' : '') +
                      prevLineText + '\n' +
                      (hasTrailingNewline ? info.text.substring(info.lineEnd + 1) : '');
      
      const offset = prevLineText.length + 1;
      const newStart = info.start - offset;
      const newEnd = info.end - offset;
      LineHelpers.updateTextarea(textarea, newValue, newStart, newEnd);
    }
    
    // Move line down - Alt+↓ / ⌥↓
    if (e.altKey && e.key === 'ArrowDown' && !ctrlOrCmd && !e.shiftKey) {
      e.preventDefault();
      const info = LineHelpers.getSelectedLines(textarea);
      
      // Can't move if already at the bottom
      if (info.lineEnd >= info.text.length) return;
      
      // Find the next line
      const nextLineStart = info.lineEnd + 1;
      const nextLineEnd = info.text.indexOf('\n', nextLineStart);
      const actualNextLineEnd = nextLineEnd === -1 ? info.text.length : nextLineEnd;
      const nextLineText = info.text.substring(nextLineStart, actualNextLineEnd);
      const nextLineHasNewline = actualNextLineEnd < info.text.length;
      
      // Swap the lines
      const beforeLines = info.text.substring(0, info.lineStart);
      const afterLines = nextLineHasNewline ? info.text.substring(actualNextLineEnd) : '';
      
      const newValue = beforeLines +
                      nextLineText + '\n' +
                      info.linesText +
                      (nextLineHasNewline ? afterLines : '');
      
      const offset = nextLineText.length + 1;
      const newStart = info.start + offset;
      const newEnd = info.end + offset;
      LineHelpers.updateTextarea(textarea, newValue, newStart, newEnd);
    }
    
    // Copy line up - Shift+Alt+↑ / ⇧⌥↑
    if (e.shiftKey && e.altKey && e.key === 'ArrowUp' && !ctrlOrCmd) {
      e.preventDefault();
      const info = LineHelpers.getSelectedLines(textarea);
      
      // Insert a copy of the selected lines above
      // Always add newline after the copied lines since they're being inserted above
      const newValue = info.text.substring(0, info.lineStart) +
                      info.linesText + '\n' +
                      info.text.substring(info.lineStart);
      
      LineHelpers.updateTextarea(textarea, newValue, info.start, info.end);
    }
    
    // Copy line down - Shift+Alt+↓ / ⇧⌥↓
    if (e.shiftKey && e.altKey && e.key === 'ArrowDown' && !ctrlOrCmd) {
      e.preventDefault();
      const info = LineHelpers.getSelectedLines(textarea);
      
      // Insert a copy of the selected lines below
      const newValue = info.text.substring(0, info.lineEnd) +
                      '\n' +
                      info.linesText +
                      info.text.substring(info.lineEnd);
      
      const offset = info.linesText.length + 1;
      const newStart = info.start + offset;
      const newEnd = info.end + offset;
      LineHelpers.updateTextarea(textarea, newValue, newStart, newEnd);
    }
    
    // Delete line - Ctrl+Shift+K / ⌘⇧K
    if (ctrlOrCmd && e.shiftKey && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      const info = LineHelpers.getSelectedLines(textarea);
      
      // Remove the selected lines
      const newValue = info.text.substring(0, info.lineStart) +
                      info.text.substring(info.lineEnd + (info.lineEnd < info.text.length ? 1 : 0));
      const newStart = Math.min(info.lineStart, newValue.length);
      LineHelpers.updateTextarea(textarea, newValue, newStart, newStart);
    }
  });
});
