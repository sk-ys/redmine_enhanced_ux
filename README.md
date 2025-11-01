# Redmine Enhanced UX Plugin

## Overview

This is a plugin for Redmine. This plugin is designed to improve the user experience within Redmine by providing various usability enhancements.  
<a href=doc/images/issue_index_example.png><image src=doc/images/issue_index_example.png width=300></a>
<a href=doc/images/issue_example.png><image src=doc/images/issue_example.png width=300></a>

## Features

- Additional JavaScript and CSS resources are loaded to enhance the visual aspects of the interface.
- Each enhancement feature can be individually enabled or disabled, allowing administrators to fine-tune the experience via the plugin settings.
- All enhancements are compatible with [Redmine ViewCustomize](https://github.com/onozaty/redmine-view-customize) plugin, allowing you to directly use the source code by copying and pasting it.
    - Source code is stored in the following directories
        - [app/views/enhanced_ux](app/views/enhanced_ux) (*.html.erb)
        - [assets/javascripts](assets/javascripts) (*.js)
        - [assets/stylesheets](assets/stylesheets) (*.css)

### Feature Details

#### Module-Specific Customization

##### Issue Index View Customization

- Custom issue list - Enhance the issue list view to keep list headers fixed with CSS ( position: sticky ), seamless updates using AJAX to avoid page reloads, and a compact criteria box for improved usability.
- Fuzzy timestamps formatter - Convert absolute timestamps in the issue list to human-readable relative time formats (e.g., "2 hours ago", "yesterday", "1 week ago").

##### Issue View Customization

- Custom issue - Customize issue views with additional fields and options, including tab display, Side By Side mode, and Quick note feature (also compatible with [RedmineRT](https://github.com/MayamaTakeshi/redmine_rt)).
- Copy issue form link with data - Copy a link to an issue form while retaining its current data.
- Issue attributes to link - Convert issue attributes to clickable links.
- Scroll to top or bottom - Add quick scroll buttons to navigate to the top or bottom of the page.

##### Issue Gantt View Customization

- Custom gantt chart - Enhance the issue Gantt chart with seamless updates using AJAX to avoid page reloads, including a compact criteria box and other usability improvements.
- Enhanced gantt entry click function - Improve click interactions on the Gantt chart for better usability and enhance performance for faster response times.

##### Other View Customizations

- Custom roadmap and version - Adjust the roadmap and version views for seamless updates using AJAX, CSS (position: sticky) for header fixation, and other usability enhancements.
- Custom calendar - Enhance calendar functionality with drag-and-drop movement of elements, a compact criteria box.
- Custom issue note list - Enhance the Custom issue note list plugin (currently in development at  [https://github.com/sk-ys/redmine\_issue\_note\_list](https://github.com/sk-ys/redmine_issue_note_list)).
- Local storage manager - Adds the ability to view and delete values stored in the browser's local storage to the "My account" page.

#### Wiki Customization

- Add copy button to the pre block - Add a button to copy the contents of pre blocks easily.
- Enhanced list button - Improve the ordered / unordered list button, including changing hierarchy levels with the Tab key, and automatically adding hierarchy markers when adding lines with the Enter key.
- Image insertion modal - Provide a modal for easier image insertion in wiki pages.
- Insert attachment tag - Quickly insert attachment tag in wiki pages.
- Responsive table scroll - Make tables in wiki pages scrollable for better viewing on smaller screens.

#### Global Customization

- Compact notice bar - Display a compact notice bar for a cleaner interface.
- Direct edit on issue list - Allow direct editing of issues from the list view, extending the context menu.
- Fix tooltip position - Correct tooltip positioning for better visibility.
- Popup anywhere - Enable popups for various internal links with Ctrl + Click.
- Show only opened issues - Filter the issue list to show only open issues using a checkbox.
- Simple menu bar - Simplify the top menu and application menu for a more compact experience.
- Two pane mode - Split the screen into two panes for easier multitasking.
- Auto reload - Automatically reload the page at the specified interval.
- Fixes for RTL design - RTL design fixes for some pages (excluding Gantt chart).

## Installation
### When using git
1. Clone this repository to your Redmine plugins directory.
    ```
    cd YOUR_REDMINE_DIRECTORY/plugins
    git clone https://github.com/sk-ys/redmine_enhanced_ux.git
    ```
2. Restart Redmine.

### When not using git
1. Download zip file from the [release page](https://github.com/sk-ys/redmine_enhanced_ux/releases) or the [latest main repository](https://github.com/sk-ys/redmine_enhanced_ux/archive/refs/heads/main.zip). 
2. Extract the ZIP file to your Redmine plugin directory. The name of the unzipped directory must be `redmine_enhanced_ux`.
3. Restart Redmine.

## Uninstallation
1. Navigate to your Redmine plugin directory.
2. Delete the directory for this plugin.
   ```
   rm -r redmine_enhanced_ux
   ```
3. Restart Redmine.

## Usage

Once installed, the plugin automatically enhances the user interface.

### Configuration

To access the plugin's settings:

1. Navigate to **Administration** → **Plugins**.
2. Click on **Configure** under the "Redmine Enhanced UX Plugin" entry.

## Compatibility

### Redmine

- Redmine 5.1 (Note: This plugin has been tested with Redmine 5.1 only.)

### Theme

- Default
- Alternate
- Classic
- [Bleuclair](https://github.com/farend/redmine_theme_farend_bleuclair)

## Support

If you encounter any issues or have suggestions for further improvements, feel free to open an issue in this repository.

## License

This plugin is released under the GPL 2.0 License. See the `LICENSE` file for more details.

