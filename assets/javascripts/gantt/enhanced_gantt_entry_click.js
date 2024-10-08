// Path pattern:       /issues/gantt
// Insertion position: Head of all pages
// Type:               HTML
// Comment:            Enhanced gantt entry click
(() => {
  let ganttEntryClickReplaced = false;

  function replaceGanttEntryClick() {
    ganttEntryClick = function (e) {
      const iconExpanderElem = e.target;
      const subjectElem = iconExpanderElem.parentElement;
      const expanderWidth = iconExpanderElem.offsetWidth;
      const recursive = e.ctrlKey;

      function toggleClass(elem, class1, class2) {
        if (!elem) return;
        elem.classList.remove(class1);
        elem.classList.add(class2);
      }

      function getLeft(elem) {
        if (!elem) return 0;
        return elem.offsetLeft || parseInt(elem.style.left);
      }

      function getTop(elem) {
        if (!elem) return 0;
        return elem.offsetTop || parseInt(elem.style.top);
      }

      function nextAll(elem, tagName) {
        const nextAllElems = [];
        let targetElem = elem.nextElementSibling;
        while (targetElem) {
          if (!tagName || targetElem.tagName === tagName) {
            nextAllElems.push(targetElem);
          }
          targetElem = targetElem.nextElementSibling;
        }
        return nextAllElems;
      }

      class GanttItem {
        constructor(elem) {
          this.elem = elem;
          this.iconExpander = elem.querySelector(":scope > .icon.expander");
          this.left =
            getLeft(this.elem) + (this.iconExpander ? expanderWidth : 0);
          this.top = getTop(this.elem);
          this.isShown =
            this.elem.offsetWidth > 0 || this.elem.offsetHeight > 0;
          this.json = JSON.parse(this.elem.dataset.collapseExpand);
          this.numberOfRows = this.elem.dataset.numberOfRows;
          this.isCollapsed =
            this.iconExpander?.classList.contains("icon-collapsed");

          const selector =
            `[data-collapse-expand="${this.json.obj_id}"]` +
            `[data-number-of-rows="${this.numberOfRows}"]`;
          this.taskBars = document.querySelectorAll(
            `#gantt_area form > ${selector}`
          );
          this.selectedColumns = document.querySelectorAll(
            `td.gantt_selected_column ${selector}`
          );
        }

        toggleIcon(force = undefined) {
          if (this.isCollapsed === undefined) return false;

          this.elem.classList.remove("open");

          if ((force === true && !(force === false)) || this.isCollapsed) {
            toggleClass(this.iconExpander, "icon-collapsed", "icon-expanded");
            this.elem.classList.add("open");
          } else {
            toggleClass(this.iconExpander, "icon-expanded", "icon-collapsed");
          }

          this.isCollapsed = !this.isCollapsed;
          return true;
        }

        #setDisplayStyle(displayStyle) {
          this.taskBars.forEach((taskBar) => {
            // TODO: Why exclude "tooltip"?
            // if (!taskBar.classList.contains("tooltip")) {
            taskBar.style.display = displayStyle;
            // }
          });
          this.selectedColumns.forEach((selectedColumn) => {
            selectedColumn.style.display = displayStyle;
          });
          this.elem.style.display = displayStyle;
        }

        hide() {
          this.#setDisplayStyle("none");
          this.isShown = false;
        }

        show() {
          this.#setDisplayStyle("");
          this.isShown = true;
        }

        move(top) {
          this.top = top;
          this.taskBars.forEach((taskBar) => {
            taskBar.style.top = `${top}px`;
          });
          this.selectedColumns.forEach((selectedColumn) => {
            selectedColumn.style.top = `${top}px`;
          });
          this.elem.style.top = `${top}px`;
        }
      }

      const subject = new GanttItem(subjectElem);
      subject.toggleIcon();

      let totalHeight = 0;
      let outOfHierarchyTop = null;
      let firstItemTop = null;
      let collapsedStateHierarchy = {};
      collapsedStateHierarchy[subject.left] = subject.isCollapsed;
      let prevItemLeft = subject.left;

      function updateGanttItemPosition(ganttItem) {
        if (outOfHierarchyTop || ganttItem.left <= subject.left) {
          if (!outOfHierarchyTop) outOfHierarchyTop = ganttItem.top;

          const newTop =
            ganttItem.top +
            (subject.isCollapsed
              ? -outOfHierarchyTop + subject.top + subject.json.top_increment
              : totalHeight);

          ganttItem.move(newTop);
          return;
        }

        if (prevItemLeft > ganttItem.left) {
          collapsedStateHierarchy = Object.fromEntries(
            Object.entries(collapsedStateHierarchy).filter(
              ([key, value]) => key < ganttItem.left
            )
          );
        }
        prevItemLeft = ganttItem.left;

        if (!firstItemTop) {
          firstItemTop = subject.top + subject.json.top_increment;
        }

        if (
          (recursive && subject.isCollapsed) ||
          (!recursive && Object.values(collapsedStateHierarchy).some((i) => i))
        ) {
          if (ganttItem.isShown) ganttItem.hide();
        } else {
          if (!ganttItem.isShown) ganttItem.show();
          ganttItem.move(firstItemTop + totalHeight);
          totalHeight += ganttItem.json.top_increment;
        }

        if (ganttItem.iconExpander) {
          collapsedStateHierarchy[ganttItem.left] = ganttItem.isCollapsed;
          if (recursive && ganttItem.isCollapsed !== subject.isCollapsed) {
            ganttItem.toggleIcon();
          }
        }
      }

      nextAll(subjectElem, "DIV")
        .map((elem) => new GanttItem(elem))
        .forEach(updateGanttItemPosition);

      drawGanttHandler();
    };

    ganttEntryClickReplaced = true;
  }

  const scriptTagAddedObserver = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      mutation.addedNodes.forEach((addedNode) => {
        if (addedNode.nodeName === "SCRIPT") {
          if (addedNode.src.includes("/javascripts/gantt.js")) {
            addedNode.onload = () => {
              replaceGanttEntryClick();
            };
            scriptTagAddedObserver.disconnect();
          }
        }
      });
    });
  });

  scriptTagAddedObserver.observe(document.head, {
    subtree: false,
    childList: true,
    attributes: false,
  });

  window.addEventListener("DOMContentLoaded", () => {
    if (!ganttEntryClickReplaced) {
      console.warn(
        "Failed to replace ganttEntryClick function, " +
          "so the process was aborted."
      );
      scriptTagAddedObserver.disconnect();
      return;
    }
  });
})();
