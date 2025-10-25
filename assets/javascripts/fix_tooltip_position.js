// Path pattern:
// Insertion position: Head of all pages
// Type:               JavaScript
// Comment:            Fix tooltip position
$(() => {
  $("[title]:not(.no-tooltip)").on("tooltipopen", function (e, ui) {
    // Update tooltip position manually

    // Temporary reset tooltip position
    ui.tooltip.css({ top: 0, left: 0 });

    // Calculate tooltip position
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    const margin = 5;
    let tooltipTop =
      $(e.target).offset().top - ui.tooltip.outerHeight() - margin;
    if (tooltipTop < 0) {
      // If tooltip goes above viewport, flip it below the element
      tooltipTop =
        $(e.target).offset().top + $(e.target).outerHeight() + margin;
    }
    // Ensure flipped tooltip is within viewport height
    if (tooltipTop + ui.tooltip.outerHeight() > clientHeight) {
      tooltipTop = clientHeight - ui.tooltip.outerHeight();
    }
    const tooltipLeft =
      $(e.target).offset().left +
      $(e.target).outerWidth() / 2 -
      ui.tooltip.outerWidth() / 2;

    // Set tooltip position
    ui.tooltip.css({
      // position: "fixed",  // Fixed positioning breaks layout on issue pages (issue found in v1.0.3)
      position: "absolute",
      top: tooltipTop,
      left: Math.min(
        Math.max(tooltipLeft, 0),
        clientWidth - ui.tooltip.outerWidth()
      ),
    });
  });
});

// Original code in application.js
// $(function () {
//   $("[title]:not(.no-tooltip)").tooltip({
//     show: {
//       delay: 400
//     },
//     position: {
//       my: "center bottom-5",
//       at: "center top"
//     }
//   });
// });
