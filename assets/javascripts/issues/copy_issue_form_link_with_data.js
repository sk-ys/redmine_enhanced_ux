// Path pattern:       /issues(|/new|/[0-9]+/copy)$
// Insertion position: Head of all pages
// Type:               JavaScript
// Comment:            Copy issue form link with data
$(() => {
  let urlBase = location.origin + location.pathname;
  if (!/\/issues(|\/new|\/[0-9]+\/copy)$/.test(urlBase)) return;
  if (/\/issues$/.test(urlBase)) urlBase += "/new";

  const $form = $("form.new_issue#issue-form");
  if ($form.length === 0) return;

  const urlDefault = new URL(urlBase + "?" + $form.serialize());
  const isCopyIssueForm = urlDefault.searchParams.has("copy_from");
  const copyFromId = urlDefault.searchParams.get("copy_from");

  const resourcesAll = {
    en: {
      label: "Copy link to the form",
      description: "Copy link to the form with current data to the clipboard.",
      messageCopiedForNewIssue: "Link to the new issue form with data has been copied.",
      messageCopiedForCopiedIssue: `Link to the copy form for the issue #${copyFromId} with data has been copied.`,
    },
    ja: {
      label: "フォームのリンクをコピー",
      description: "現在の入力内容を含むフォームのリンクをクリップボードにコピーします。",
      messageCopiedForNewIssue: "現在の入力内容を含む新規チケットフォームのリンクをコピーしました。",
      messageCopiedForCopiedIssue: `チケット#${copyFromId}の入力内容を含むコピー用フォームのリンクをコピーしました。`,
    },
  };

  const resources =
    resourcesAll[document.documentElement.lang] || resourcesAll["en"];

  const $copyButton = $("<button>")
    .text(resources.label)
    .attr({
      title: resources.description,
      type: "submit",
      value: resources.label,
    })
    .css({ userSelect: "none" })
    .on("click", function (e) {
      e.preventDefault();
      const url = new URL(urlBase + "?" + $form.serialize());
      url.searchParams.delete("utf8");
      url.searchParams.delete("authenticity_token");
      if (window.copyTextToClipboard) {
        $(this).attr("data-clipboard-text", url.href);
        window.copyTextToClipboard(this);
      } else {
        window.copyToClipboard(url.href);
      }
      const $copiedMessage = $("<span>")
        .css({
          display: "inlineBlock",
          margin: "0 5px",
          backgroundColor: "#9fcf9f",
          padding: "2px 4px",
          borderRadius: "3px",
        })
        .text(
          isCopyIssueForm
            ? resources.messageCopiedForCopiedIssue
            : resources.messageCopiedForNewIssue
        )
        .appendTo($form);
      setTimeout(() => {
        $copiedMessage.fadeOut("slow", function () {
          $(this).remove();
        });
      }, 3000);
    })
    .appendTo($form);
});
