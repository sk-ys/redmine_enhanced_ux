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

  // Localized messages (update_relative_time_in_realtime.js style)
  const translations = {
    en: {
      less_than_x_seconds: "less than %count% seconds",
      half_a_minute: "half a minute",
      less_than_a_minute: "less than a minute",
      one_minute: "1 minute",
      minutes: "%count% minutes",
      about_one_hour: "about 1 hour",
      hours: "about %count% hours",
      one_day: "1 day",
      days: "%count% days",
      about_one_month: "about 1 month",
      months: "%count% months",
      about_one_year: "about 1 year",
      years: "over %count% years",
      relativeTimeSuffix: " ago",
    },
    ja: {
      less_than_x_seconds: "%count%秒未満",
      half_a_minute: "30秒前後",
      less_than_a_minute: "1分未満",
      one_minute: "1分",
      minutes: "%count%分",
      about_one_hour: "約1時間",
      hours: "約%count%時間",
      one_day: "1日",
      days: "%count%日",
      about_one_month: "約1ヶ月",
      months: "%count%ヶ月",
      about_one_year: "約1年",
      years: "%count%年以上",
      relativeTimeSuffix: "前",
    },
  };

  function getLanguage() {
    const lang = (document.documentElement.lang || navigator.language || "en")
      .split("-")[0]
      .toLowerCase();
    return translations[lang] ? lang : "en";
  }

  function interpolate(text, count) {
    return text.replace(/%count%/g, count);
  }

  function getRelativeTime(fromTime, toTime = new Date()) {
    const lang = getLanguage();
    const t = translations[lang];

    const fromDate = new Date(fromTime);
    const toDate = new Date(toTime);
    const secondsDiff = Math.floor(
      (toDate.getTime() - fromDate.getTime()) / 1000,
    );

    const minutes = Math.floor(secondsDiff / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    let ret = "";
    if (secondsDiff < 5) {
      ret = interpolate(t.less_than_x_seconds, 5);
    } else if (secondsDiff < 10) {
      ret = interpolate(t.less_than_x_seconds, 10);
    } else if (secondsDiff < 20) {
      ret = interpolate(t.less_than_x_seconds, 20);
    } else if (secondsDiff < 40) {
      ret = t.half_a_minute;
    } else if (secondsDiff < 60) {
      ret = t.less_than_a_minute;
    } else if (secondsDiff < 90) {
      ret = t.one_minute;
    } else if (minutes < 45) {
      ret = interpolate(t.minutes, minutes);
    } else if (minutes < 90) {
      ret = t.about_one_hour;
    } else if (hours < 24) {
      ret = interpolate(t.hours, Math.round(hours));
    } else if (days === 1) {
      ret = t.one_day;
    } else if (days < 30) {
      ret = interpolate(t.days, days);
    } else if (days < 60) {
      ret = t.about_one_month;
    } else if (months < 12) {
      ret = interpolate(t.months, months);
    } else if (years === 1) {
      ret = t.about_one_year;
    } else {
      ret = interpolate(t.years, years);
    }

    ret += t.relativeTimeSuffix;
    return ret;
  }

  function replaceUpdatedOn(elem, baseDate) {
    try {
      const dateText = $(elem).text();
      const date = new Date(dateText);
      if (isNaN(date)) return;

      baseDate = baseDate || new Date();
      const relative = getRelativeTime(date, baseDate);

      $(elem).text(relative).attr("title", dateText);
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
