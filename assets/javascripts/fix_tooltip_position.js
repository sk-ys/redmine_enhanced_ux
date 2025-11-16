// Path pattern:
// Insertion position: Head of all pages
// Type:               JavaScript
// Comment:            Fix tooltip position
// Description:        Adjust tooltip positions to ensure they remain within the viewport.
$(() => {
  $("[title]:not(.no-tooltip)").on("tooltipopen", function (e, ui) {
    const tooltip = ui.tooltip;
    const targetRect = e.target.getBoundingClientRect();
    const targetOffset = $(e.target).offset();
    const tooltipParentOffset = tooltip.parent().offset();

    // Get default CSS position
    const tooltipDefaultTop = parseFloat(tooltip.css("top"));
    const tooltipDefaultLeft = parseFloat(tooltip.css("left"));

    // Calculate tooltip size
    const originalPosition = tooltip.css("position");
    tooltip.css({ position: "fixed", top: 0, left: 0 });
    const tooltipWidth = tooltip.outerWidth();
    const tooltipHeight = tooltip.outerHeight();
    tooltip.css({
      position: originalPosition,
      top: tooltipDefaultTop,
      left: tooltipDefaultLeft,
    });

    // Calculate relative offset from target to tooltip
    const relativeOffsetX =
      tooltipDefaultLeft + tooltipParentOffset.left - targetOffset.left;
    const relativeOffsetY =
      tooltipDefaultTop + tooltipParentOffset.top - targetOffset.top;

    // Adjust position to keep tooltip within viewport
    let offsetX = 0;
    let offsetY = 0;

    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;

    // Calculate current position on page
    const tooltipPageTop = targetRect.top + relativeOffsetY;
    const tooltipPageLeft = targetRect.left + relativeOffsetX;

    // Adjust vertical position
    if (tooltipPageTop < 0) {
      offsetY = -tooltipPageTop + tooltipHeight;
    } else if (tooltipPageTop + tooltipHeight > viewportHeight) {
      offsetY = -(tooltipPageTop + tooltipHeight - viewportHeight);
    }

    // Adjust horizontal position
    if (tooltipPageLeft < 0) {
      offsetX = -tooltipPageLeft;
    } else if (tooltipPageLeft + tooltipWidth > viewportWidth) {
      offsetX = -(tooltipPageLeft + tooltipWidth - viewportWidth);
    }

    // Apply adjusted position
    tooltip.css({
      top: tooltipDefaultTop + offsetY,
      left: tooltipDefaultLeft + offsetX,
    });
  });
});
