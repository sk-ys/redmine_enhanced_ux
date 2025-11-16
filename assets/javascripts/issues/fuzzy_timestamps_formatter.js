// Path pattern:       /issues$
// Insertion position: Head of all pages
// Type:               JavaScript
// Comment:            Fuzzy timestamps formatter for issue list
window.addEventListener("DOMContentLoaded", function () {
  const targetSelector = "table.issues.list td.updated_on";

  // Exit if no target elements found
  if ($(targetSelector).length === 0) return;

  // Define time units in seconds
  const TIME_UNITS = {
    SECOND: 1,
    MINUTE: 60,
    HOUR: 60 * 60,
    DAY: 24 * 60 * 60,
    WEEK: 7 * 24 * 60 * 60,
    MONTH: 30 * 24 * 60 * 60,
    YEAR: 365 * 24 * 60 * 60,
  };

  // Localized messages
  const messagesAll = {
    en: {
      justThen: "just then",
      seconds: " seconds ago",
      aMinute: "a minute ago",
      minutes: " minutes ago",
      oneHour: "1 hour ago",
      hours: " hours ago",
      yesterday: "yesterday",
      days: " days ago",
      oneWeek: "1 week ago",
      weeks: " weeks ago",
      aMonth: "a month ago",
      months: " months ago",
      oneYear: "1 year ago",
      years: " years ago",
    },
    ja: {
      justThen: "たった今",
      seconds: "秒前",
      aMinute: "1分前",
      minutes: "分前",
      oneHour: "1時間前",
      hours: "時間前",
      yesterday: "昨日",
      days: "日前",
      oneWeek: "1週間前",
      weeks: "週間前",
      aMonth: "1ヶ月前",
      months: "ヶ月前",
      oneYear: "1年以上前",
      years: "年以上前",
    },
  };

  const messages =
    messagesAll[document.documentElement.lang] || messagesAll["en"];

  function getFuzzyTime(delta) {
    if (delta < 30) {
      return messages.justThen;
    } else if (delta < TIME_UNITS.MINUTE) {
      return delta + messages.seconds;
    } else if (delta < 2 * TIME_UNITS.MINUTE) {
      return messages.aMinute;
    } else if (delta < TIME_UNITS.HOUR) {
      return Math.floor(delta / TIME_UNITS.MINUTE) + messages.minutes;
    } else if (delta < TIME_UNITS.DAY) {
      return Math.floor(delta / TIME_UNITS.HOUR) === 1
        ? messages.oneHour
        : Math.floor(delta / TIME_UNITS.HOUR) + messages.hours;
    } else if (delta < 2 * TIME_UNITS.DAY) {
      return messages.yesterday;
    } else if (delta < TIME_UNITS.WEEK) {
      return Math.floor(delta / TIME_UNITS.DAY) + messages.days;
    } else if (delta < 2 * TIME_UNITS.WEEK) {
      return messages.oneWeek;
    } else if (delta < TIME_UNITS.MONTH) {
      return Math.floor(delta / TIME_UNITS.WEEK) + messages.weeks;
    } else if (delta < TIME_UNITS.MONTH * 2) {
      return messages.aMonth;
    } else if (delta < TIME_UNITS.YEAR) {
      return Math.floor(delta / TIME_UNITS.MONTH) + messages.months;
    } else if (delta < TIME_UNITS.YEAR * 2) {
      return messages.oneYear;
    } else {
      return Math.floor(delta / TIME_UNITS.YEAR) + messages.years;
    }
  }

  function replaceUpdatedOn(elem, baseDate) {
    try {
      const dateText = $(elem).text();
      const date = new Date(dateText);
      if (isNaN(date)) return;

      baseDate = baseDate || new Date();
      const delta = Math.round((baseDate - date) / 1000);
      const fuzzy = getFuzzyTime(delta);

      $(elem).text(fuzzy).attr("title", dateText);
    } catch (error) {
      console.warn("Failed to parse timestamp:", dateText, error);
    }
  }

  function updateIssueListTimes() {
    const now = new Date();
    $(targetSelector).each((_, e) => replaceUpdatedOn(e, now));
  }

  if (window.ajaxUpdateIssueList) {
    const original = ajaxUpdateIssueList;
    ajaxUpdateIssueList = async function (settings) {
      await original(settings);
      updateIssueListTimes();
    };
  }

  updateIssueListTimes();
});
