// Path pattern:
// Insertion position: Head of all pages
// Type:               JavaScript
// Comment:            Update relative time in real-time
// Description:        Updates relative time displays every minute for activity links and timestamps
(function () {
  "use strict";

  const TIME_UPDATE_INTERVAL_MS = 60000; // 1 minute in milliseconds

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
    de: {
      less_than_x_seconds: "weniger als %count% Sekunden",
      half_a_minute: "eine halbe Minute",
      less_than_a_minute: "weniger als eine Minute",
      one_minute: "1 Minute",
      minutes: "%count% Minuten",
      about_one_hour: "etwa 1 Stunde",
      hours: "etwa %count% Stunden",
      one_day: "1 Tag",
      days: "%count% Tage",
      about_one_month: "etwa 1 Monat",
      months: "%count% Monate",
      about_one_year: "etwa 1 Jahr",
      years: "mehr als %count% Jahre",
      relativeTimeSuffix: " her",
    },
    es: {
      less_than_x_seconds: "menos de %count% segundos",
      half_a_minute: "medio minuto",
      less_than_a_minute: "menos de un minuto",
      one_minute: "1 minuto",
      minutes: "%count% minutos",
      about_one_hour: "alrededor de 1 hora",
      hours: "alrededor de %count% horas",
      one_day: "1 día",
      days: "%count% días",
      about_one_month: "alrededor de 1 mes",
      months: "%count% meses",
      about_one_year: "alrededor de 1 año",
      years: "más de %count% años",
      relativeTimeSuffix: " atrás",
    },
    fr: {
      less_than_x_seconds: "moins de %count% secondes",
      half_a_minute: "une demi-minute",
      less_than_a_minute: "moins d'une minute",
      one_minute: "1 minute",
      minutes: "%count% minutes",
      about_one_hour: "environ 1 heure",
      hours: "environ %count% heures",
      one_day: "1 jour",
      days: "%count% jours",
      about_one_month: "environ 1 mois",
      months: "%count% mois",
      about_one_year: "environ 1 an",
      years: "plus de %count% ans",
      relativeTimeSuffix: " auparavant",
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
    ko: {
      less_than_x_seconds: "%count%초 미만",
      half_a_minute: "30초",
      less_than_a_minute: "1분 미만",
      one_minute: "1분",
      minutes: "%count%분",
      about_one_hour: "약 1시간",
      hours: "약 %count%시간",
      one_day: "1일",
      days: "%count%일",
      about_one_month: "약 1개월",
      months: "%count%개월",
      about_one_year: "약 1년",
      years: "%count%년 이상",
      relativeTimeSuffix: "전",
    },
    pt: {
      less_than_x_seconds: "menos de %count% segundos",
      half_a_minute: "meio minuto",
      less_than_a_minute: "menos de um minuto",
      one_minute: "1 minuto",
      minutes: "%count% minutos",
      about_one_hour: "cerca de 1 hora",
      hours: "cerca de %count% horas",
      one_day: "1 dia",
      days: "%count% dias",
      about_one_month: "cerca de 1 mês",
      months: "%count% meses",
      about_one_year: "cerca de 1 ano",
      years: "mais de %count% anos",
      relativeTimeSuffix: " atrás",
    },
    ru: {
      less_than_x_seconds: "меньше %count% секунд",
      half_a_minute: "полминуты",
      less_than_a_minute: "меньше минуты",
      one_minute: "1 минута",
      minutes_few: "%count% минуты",
      minutes: "%count% минут",
      about_one_hour: "около 1 часа",
      hours_few: "около %count% часов",
      hours: "около %count% часов",
      one_day: "1 день",
      days_few: "%count% дня",
      days: "%count% дней",
      about_one_month: "около 1 месяца",
      months_few: "%count% месяца",
      months: "%count% месяцев",
      about_one_year: "около 1 года",
      years_few: "%count% года",
      years: "%count% лет",
      relativeTimeSuffix: " назад",
    },
    zh: {
      less_than_x_seconds: "少于%count%秒",
      half_a_minute: "半分钟",
      less_than_a_minute: "少于1分钟",
      one_minute: "1分钟",
      minutes: "%count%分钟",
      about_one_hour: "大约1小时",
      hours: "大约%count%小时",
      one_day: "1天",
      days: "%count%天",
      about_one_month: "大约1个月",
      months: "%count%个月",
      about_one_year: "大约1年",
      years: "超过%count%年",
      relativeTimeSuffix: "前",
    },
    "zh-TW": {
      less_than_x_seconds: "少於%count%秒",
      half_a_minute: "半分鐘",
      less_than_a_minute: "少於1分鐘",
      one_minute: "1分鐘",
      minutes: "%count%分鐘",
      about_one_hour: "大約1小時",
      hours: "大約%count%小時",
      one_day: "1天",
      days: "%count%天",
      about_one_month: "大約1個月",
      months: "%count%個月",
      about_one_year: "大約1年",
      years: "超過%count%年",
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

  function distanceOfTimeInWords(
    fromTime,
    appendAgoSuffix = false,
    toTime = new Date(),
  ) {
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
    } else if (t.minutes_few && minutes < 5) {
      ret = interpolate(t.minutes_few, minutes);
    } else if (minutes < 45) {
      ret = interpolate(t.minutes, minutes);
    } else if (minutes < 90) {
      ret = t.about_one_hour;
    } else if (t.hours_few && Math.round(hours) < 5) {
      ret = interpolate(t.hours_few, Math.round(hours));
    } else if (hours < 24) {
      ret = interpolate(t.hours, Math.round(hours));
    } else if (days === 1) {
      ret = t.one_day;
    } else if (t.days_few && days < 5) {
      ret = interpolate(t.days_few, days);
    } else if (days < 30) {
      ret = interpolate(t.days, days);
    } else if (days < 60) {
      ret = t.about_one_month;
    } else if (t.months_few && months < 5) {
      ret = interpolate(t.months_few, months);
    } else if (months < 12) {
      ret = interpolate(t.months, months);
    } else if (years === 1) {
      ret = t.about_one_year;
    } else if (t.years_few && years < 5) {
      ret = interpolate(t.years_few, years);
    } else {
      ret = interpolate(t.years, years);
    }

    if (appendAgoSuffix && ret !== t.in_the_future) {
      ret += t.relativeTimeSuffix;
    }

    return ret;
  }

  function updateRelativeTime() {
    document
      .querySelectorAll("a[href*='/activity?from='], .updated_on")
      .forEach((el) => {
        const timestampStr = el.getAttribute("title");
        const timestamp = new Date(timestampStr);
        if (timestamp.getTime()) {
          el.textContent = distanceOfTimeInWords(
            timestamp,
            el.classList.contains("updated_on"),
          );
        }
      });
  }

  // Setup periodic update every minute
  let updateInterval = null;

  function startUpdating() {
    stopUpdating();
    updateInterval = setInterval(updateRelativeTime, TIME_UPDATE_INTERVAL_MS);
  }

  function stopUpdating() {
    if (updateInterval !== null) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
  }

  // Monitor visibility state
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopUpdating();
    } else {
      updateRelativeTime();
      startUpdating();
    }
  });

  // Initial execution
  startUpdating();
})();
