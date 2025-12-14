// Path pattern:       /issues/gantt
// Insertion position: Head of all pages
// Type:               HTML
// Comment:            Enhanced gantt entry click
(() => {
  let ganttEntryClickReplaced = false;

  function replaceGanttEntryClick() {
    ganttEntryClick = function (e) {
      const iconExpanderElem = e.currentTarget;
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
          const svgIcon = this.iconExpander.getElementsByTagName("svg");

          if ((force === true && !(force === false)) || this.isCollapsed) {
            toggleClass(this.iconExpander, "icon-collapsed", "icon-expanded");
            this.elem.classList.add("open");
            if (svgIcon.length === 1 && window.updateSVGIcon) {
              updateSVGIcon(this.iconExpander, "angle-down");
            }
          } else {
            toggleClass(this.iconExpander, "icon-expanded", "icon-collapsed");
            if (svgIcon.length === 1 && window.updateSVGIcon) {
              updateSVGIcon(this.iconExpander, "angle-right");
            }
          }

          this.isCollapsed = !this.isCollapsed;
          return true;
        }

        #setDisplayStyle(displayStyle) {
          this.taskBars.forEach((taskBar) => {
            taskBar.style.display = displayStyle;
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
      const collapsedStateHierarchy = new Map();
      collapsedStateHierarchy.set(subject.left, subject.isCollapsed);
      let prevItemLeft = subject.left;

      function updateGanttItemPositionAndView(ganttItem) {
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

        // Clear the collapsed state for levels deeper than the current
        // hierarchy level
        if (prevItemLeft > ganttItem.left) {
          for (const left of collapsedStateHierarchy.keys()) {
            if (left >= ganttItem.left) collapsedStateHierarchy.delete(left);
          }
        }

        // Update the stored left value for the next loop
        prevItemLeft = ganttItem.left;

        if (!firstItemTop) {
          firstItemTop = subject.top + subject.json.top_increment;
        }

        if (
          (recursive && subject.isCollapsed) ||
          (!recursive && collapsedStateHierarchy.values().some((i) => i))
        ) {
          if (ganttItem.isShown) ganttItem.hide();
        } else {
          if (!ganttItem.isShown) ganttItem.show();
          ganttItem.move(firstItemTop + totalHeight);
          totalHeight += ganttItem.json.top_increment;
        }

        if (ganttItem.iconExpander) {
          collapsedStateHierarchy.set(ganttItem.left, ganttItem.isCollapsed);
          if (recursive && ganttItem.isCollapsed !== subject.isCollapsed) {
            ganttItem.toggleIcon();
          }
        }
      }

      // Get all subsequent DIV elements, convert to GanttItem,
      // and update their positions and view states
      nextAll(subjectElem, "DIV")
        .map((elem) => new GanttItem(elem))
        .forEach(updateGanttItemPositionAndView);

      drawGanttHandler();
    };

    ganttEntryClickReplaced = true;
  }

  const scriptTagAddedObserver = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      mutation.addedNodes.forEach((addedNode) => {
        if (addedNode.nodeName === "SCRIPT") {
          if (
            /\/assets\/gantt-.*.js$/.test(addedNode.src) || // Redmine 6+
            /\/javascripts\/gantt.js\?\d+$/.test(addedNode.src) // Redmine 5
          ) {
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
