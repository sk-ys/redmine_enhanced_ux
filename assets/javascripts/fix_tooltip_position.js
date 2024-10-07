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
    const margin = 5;
    const tooltipTop =
      $(e.target).offset().top - ui.tooltip.outerHeight() - margin;
    const tooltipTopFlipped =
      $(e.target).offset().top + $(e.target).outerHeight() + margin;
    const tooltipLeft =
      $(e.target).offset().left +
      $(e.target).outerWidth() / 2 -
      ui.tooltip.outerWidth() / 2;

    // Set tooltip position
    ui.tooltip.css({
      position: "fixed",
      top: tooltipTop > 0 ? tooltipTop : tooltipTopFlipped,
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
