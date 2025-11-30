// Path pattern:       /issues/[0-9]+$
// Insertion position: Head of all pages
// Type:               HTML
// Comment:            Issue attributes to link
window.addEventListener("DOMContentLoaded", () => {
  // Define priority, status, category parameters
  const configs = [
    {
      selector: ".priority.attribute .value",
      idSelector: "#issue_priority_id>option:selected",
      param: "priority_id",
    },
    {
      selector: ".status.attribute .value",
      idSelector: "#issue_status_id>option:selected",
      param: "status_id",
    },
    {
      selector: ".category.attribute .value",
      idSelector: "#issue_category_id>option:selected",
      param: "category_id",
    },
  ];

  const homeUrl =
    ["login", "logout"]
      .map(
        (key) =>
          $("." + key)
            .attr("href")
            ?.split(key)[0]
      )
      .filter((i) => i)[0] || "/";

  const projectIdentifier = $("body")
    .attr("class")
    .split(" ")
    .filter((i) => i.match(/^project-/))[0]
    ?.match(/^project-(.+)/)[1];

  function generateIssueLink(url, text) {
    configs.forEach((config) => {
      const targets = $("#content .issue .attributes " + config.selector);
      if (targets.length == 0) return;

      const idValue = $(config.idSelector).val();
      if (idValue == undefined) return;

      const search =
        `?set_filter=1` +
        `&f[]=${config.param}` +
        `&op[${config.param}]==` +
        `&v[${config.param}][]=${idValue}`;

      const issueListUrl =
        homeUrl + "projects/" + projectIdentifier + "/issues" + search;

      targets.each(function () {
        $(this).html($("<a>").attr("href", issueListUrl).text(this.innerHTML));
      });
    });
  }

  // Initial generation
  generateIssueLink();

  /**
   * Set up form change detection.
   * This method's purpose is to detect when the issue view is replaced by
   * other plugins like Redmine RT.
   */
  function setupFormChangeDetection() {
    const targetNode = $("div.issue.details").parent()[0];

    if (targetNode) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (
                node.nodeType === Node.ELEMENT_NODE &&
                $(node).is("div.issue.details")
              ) {
                generateIssueLink();
              }
            });
          }
        });
      });

      observer.observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: false,
      });
    }
  }

  // Set up form change detection
  setupFormChangeDetection();
});
