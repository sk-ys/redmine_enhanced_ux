// Path:               pattern
// Insertion position: Head of all pages
// Type:               JavaScript
// Comment:            Responsive Table Scroll
$(() => {
  $("div.wiki > table").each((_, e) => {
    const $tableOuter = $("<div>")
      .addClass("table-outer")
      .css({ overflowX: "auto" })
      .insertBefore(e);
    $(e).css({ margin: 0 }).appendTo($tableOuter);
  });
});
