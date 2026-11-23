// Path pattern:       /projects/[^/]+(/issues(|/gantt|/calendar|)|/issue_note_list)$
// Insertion position: Head of all pages
// Type:               JavaScript
// Comment:            Adds a cross project search link to the issue query form
addEventListener("DOMContentLoaded", () => {
  const queryForm = document.querySelector("#query_form");
  if (!queryForm) return;
  if (!document.querySelector("body[class^='project-']")) return;

  const i18nAll = {
    en: {
      crossProjectSearch: "Cross Project Search",
      crossProjectSearchDescription:
        "Apply current search conditions across all projects",
    },
    ja: {
      crossProjectSearch: "プロジェクト横断検索",
      crossProjectSearchDescription:
        "現在の検索条件をプロジェクトを横断して適用します",
    },
  };
  const i18n = { ...i18nAll["en"], ...i18nAll[document.documentElement.lang] };

  function prependCrossProjectSearchLink() {
    if (
      document.querySelector(
        "#query_form_with_buttons .search-across-all-projects",
      )
    )
      return;

    const crossProjectsSearchLink = document.createElement("a");
    crossProjectsSearchLink.classList.add("search-across-all-projects");
    crossProjectsSearchLink.textContent = i18n.crossProjectSearch;
    crossProjectsSearchLink.setAttribute(
      "title",
      i18n.crossProjectSearchDescription,
    );
    Object.assign(crossProjectsSearchLink.style, {
      cursor: "pointer",
      marginRight: "1em",
      position: "absolute",
      left: "20px",
    });
    crossProjectsSearchLink.addEventListener("click", () => {
      location.href = location.href.replace(/(\/projects\/.+\/)/, "/");
    });

    const queryButtons = document.querySelector(
      "#query_form_with_buttons>.buttons",
    );
    queryButtons?.prepend(crossProjectsSearchLink);
  }

  // Initial invocation to prepend the cross project search link
  prependCrossProjectSearchLink();

  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        prependCrossProjectSearchLink();
      }
    });
    prependCrossProjectSearchLink();
  }).observe(queryForm, { childList: true });
});
